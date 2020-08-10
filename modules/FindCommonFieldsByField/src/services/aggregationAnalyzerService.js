const logger = require('../../../../library/utils/logger')

module.exports = {
    sheetData: [],
    logMessage: {
        a: `\nStep8: Analyzing aggregation results. \n`
    },
    analyze(aggregationResults) {
        let responses = [];
        logger.log(this.logMessage.a)
        aggregationResults.forEach((obj)=>{
            responses.push(...obj.responses);
        });
        responses = responses.map((obj)=> obj.aggregations)
        responses.forEach((obj)=> {
            this.sheetData.push(this.getRowObj(obj));
        });
        return this.sheetData;
    },
    getRowObj(obj){
        let field_name = this.getFieldName(obj);
        let commonFieldValues = this.getCommonFieldValues(obj[field_name]);
        let isCommonField = this.checkCommonField(commonFieldValues);
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
        let keys = "";
        buckets.forEach((bucket,index)=> {
            let str = index+1 === buckets.length ? "" : ",";
            keys += bucket.key+str
        });
        return keys;
    },
    checkCommonField(str) {
        const commonArr = process.env.COMMON_ARR.split(",");
        let isCommonField = true;
        let current = str.split(",");
        if ((current.length != commonArr.length)) return false;
        return isCommonField;
    },
    splitNested(str){
        const nestedStr = process.env.EXTRA_NESTED_OBJECT_POINTER;
        if(nestedStr) 
            return str.replace(nestedStr+".", "");
    }
}