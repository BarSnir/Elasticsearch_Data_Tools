const commonFieldQueryTemplate = require('../templates/commonFieldQuery.json');
const objectPathGet = require('object-path-get')
const objectPathSet = require('object-path-set');

module.exports = {
    queryTemplate: null,
    objectPathQuery: "query.exists.field",
    objectPathAggregation: "aggs.common_field.aggs.values.terms.field",
    objectPathCommonValue: "aggs.common_field.terms.field",
    getQueries(fieldNames){
        const queries = [];
        this.queryTemplate = commonFieldQueryTemplate;
        for (let i=0; i < fieldNames.length; i++){
            const msDirectionObj = { index: process.env.ELASTICSEARCH_INDEX_NAME}
            queries.push(msDirectionObj);
            const query = this.getQuery(fieldNames[i]);
            queries.push(query)
        }
        return queries;
    },
    getQuery(fieldName) {
        this.fillValues(fieldName)
            .fillCommonFieldValue();
        return this.queryTemplate;
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
    }
}