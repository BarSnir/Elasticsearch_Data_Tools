const objectPath = require('object-path-get');

module.exports = {
    keywordPath: "fields.keyword.type",
    extraNestedKey: "EXTRA_NESTED_OBJECT_POINTER",
    emptyString: "",
    getFieldNames(mappingObj) {
        const fieldNames = this.prepareDataToQuery(mappingObj);
        return fieldNames;
    },
    prepareDataToQuery(mappingObj){
        const fieldNames = []
        for(const key in mappingObj){
            const value = mappingObj[key];
            const fieldName = this.getDataType(key, value);
            fieldNames.push(fieldName);
        }
        return fieldNames;
    },
    getDataType(key, object){
        if(this.isExtraNestedObjDefined()) 
            return `${process.env.EXTRA_NESTED_OBJECT_POINTER}.${key}${this.getType(object)}`
        return `${key}`
    },
    getType(object){
        if(objectPath(object, this.keywordPath)) 
            return `.${objectPath(object, this.keywordPath)}`;
        return this.emptyString;
    },
    isExtraNestedObjDefined(){
        return process.env.hasOwnProperty(this.extraNestedKey);
    },
}