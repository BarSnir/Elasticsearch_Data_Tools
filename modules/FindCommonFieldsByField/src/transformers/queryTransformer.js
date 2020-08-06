const objectPath = require('object-path-get');

module.exports = {
    dataToQuery: {},
    keywordPath: "fields.keyword.type",
    getQuery(mappingObj) {
        const preparedData = this.prepareDataToQuery(mappingObj);
        
    },
    prepareDataToQuery(mappingObj){
        for(const key in mappingObj){
            const value = mappingObj[key];
            const dataType = this.getDataType(value);
            this.dataToQuery[key] = dataType;
        }
        return this.dataToQuery
    },
    getDataType(object){
        if(objectPath(object, this.keywordPath)) 
            return objectPath(object, this.keywordPath)
        return object.type
    },
}