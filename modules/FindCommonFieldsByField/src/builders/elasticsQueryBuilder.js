const commonFieldQueryTemplate = require('../templates/commonFieldQuery.json');
const logger = require('../.../../../../../library/utils/logger');
const objectPathSet = require('object-path-set');
const jsonUtils = require('../../../../library/utils/json/jsonUtil')

module.exports = {
    queryTemplate: null,
    prevKeyName: null,
    objectPathQuery: "query.exists.field",
    objectPathAggregation: "aggs.common_fields.aggs.value_sample.terms.field",
    objectPathCommonValue: "aggs.common_fields.terms.field",
    logMessages:{
        a:`Step5: Constructed the quires. Now lets performing multi search.\n`
    },
    getQueries(fieldNames){
        const queries = [];
        this.queryTemplate = commonFieldQueryTemplate;
        for (let i=0; i < fieldNames.length; i++){
            const msDirectionObj = { index: process.env.ELASTICSEARCH_INDEX_NAME}
            queries.push(msDirectionObj);
            const query = this.getQuery(fieldNames[i]);
            queries.push(jsonUtils.getFreshCopy(query))
        }
        logger.log(this.logMessages.a)
        return queries;
    },
    getQuery(fieldName) {
        return this.fillValues(fieldName)
                    .fillCommonFieldValue()
                    .replaceCommonAggregationName(fieldName);
    },
    fillValues(fieldName){
        objectPathSet(this.queryTemplate, this.objectPathQuery, fieldName)
        objectPathSet(this.queryTemplate, this.objectPathAggregation, fieldName)
        return this;
    },
    fillCommonFieldValue(){
        const commonFieldName = process.env.COMMON_FIELD_NAME
        objectPathSet(this.queryTemplate, this.objectPathCommonValue, commonFieldName)
        return this;
    },
    replaceCommonAggregationName(fieldName) {
        const commonAggObj = jsonUtils.getFreshCopy(
            this.queryTemplate.aggs.common_fields
        )
        if(this.prevKeyName)
            delete this.queryTemplate.aggs[this.prevKeyName]
        
        this.queryTemplate.aggs[fieldName] = commonAggObj;
        this.prevKeyName = fieldName;
        delete this.queryTemplate.aggs.common_fields
        return this.queryTemplate;
    }
}