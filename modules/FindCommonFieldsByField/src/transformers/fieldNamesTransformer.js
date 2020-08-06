const objectPath = require('object-path-get');

module.exports = {
    fieldsNames: [],
    keywordPath: "fields.keyword.type",
    getQuery(mappingObj) {
        const fieldNames = this.prepareDataToQuery(mappingObj);
        return fieldNames;
    },
    prepareDataToQuery(mappingObj){
        for(const key in mappingObj){
            const value = mappingObj[key];
            const fieldName = this.getDataType(key, value);
            this.fieldsNames.push(fieldName);
        }
        console.log(this.fieldsNames);
        return this.fieldsNames;
    },
    getDataType(key, object){
        if(this.isExtraNestedObjDefined()) 
            return `${process.env.EXTRA_NESTED_OBJECT_POINTER}.${key}${this.getType(object)}`
        return `${key}`
    },
    getType(object){
        if(objectPath(object, this.keywordPath)) 
            return `.${objectPath(object, this.keywordPath)}`;
        return ""
    },
    isExtraNestedObjDefined(){
        return process.env.hasOwnProperty('EXTRA_NESTED_OBJECT_POINTER');
    },
}