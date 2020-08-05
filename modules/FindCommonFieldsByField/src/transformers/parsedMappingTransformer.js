const objectPath = require('object-path-get');

module.exports = {
    indexMapping: null,
    getParsedMapping(indexMapping) {
        return this.extractNested(indexMapping).removedFields().sendMapping()
    },
    extractNested(indexMapping){
        this.indexMapping = objectPath(indexMapping, process.env.EXTRA_NESTED_OBJECT);
        return this;
    },
    removedFields(){
        if (!process.env.DELETE_FIELDS) return this
        const deleteKeysArr = process.env.DELETE_FIELDS.split(",");
        for (let i = 0; i <= deleteKeysArr.length; i++) {
            delete this.indexMapping[deleteKeysArr[i]];
        }
        return this
    },
    sendMapping() {
        return this.indexMapping;
    }
    
}