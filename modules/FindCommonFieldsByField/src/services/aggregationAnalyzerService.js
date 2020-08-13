const logger = require('../../../../library/utils/logger');
const stringsUtil = require('../../../../library/utils/strings')
const aggsValidator = require('../validators/aggregationValidator');

module.exports = {
    sheetData: [],
    logMessage: {
        a: `\nStep8: Analyzing aggregation results. \n`
    },
    analyze(aggregationResults) {
        let responses = [];
        logger.log(this.logMessage.a)
        aggregationResults.forEach((obj) => {
            responses.push(...obj.responses);
        });
        responses = responses.map(obj => obj.aggregations);
        responses = responses.filter(obj => aggsValidator.runValidate(obj));
        responses.forEach((obj)=> {
            this.sheetData.push(this.getRowObj(obj));
        });
        return this.sheetData;
    },
    getRowObj(obj){
        let field_name = this.getFieldName(obj);
        let commonFieldValues = this.getCommonFieldValues(obj[field_name]);
        let isCommonField = true;
        field_name = this.splitNested(field_name)
        return {
            field_name,
            commonFieldValues,
            isCommonField,
        }
    },
    getFieldName(obj){
        return Object.keys(obj)[0]; 
    },
    getCommonFieldValues(obj) {
        const buckets = obj.buckets;
        let keys = stringsUtil.emptyString;
        buckets.forEach((bucket,index)=> {
            const condition = index+1 === buckets.length
            let str = stringsUtil.isEndOfArry(condition)
            keys += bucket.key+str
        });
        return keys;
    },
    splitNested(str){
        const nestedStr = process.env.EXTRA_NESTED_OBJECT_POINTER;
        if(nestedStr) 
            return str.replace(
                nestedStr+stringsUtil.dot, 
                stringsUtil.emptyString
            );
    }
}