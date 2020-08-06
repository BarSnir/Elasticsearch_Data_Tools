const objectPath = require('object-path-get');

module.exports = {
    indexMapping: null,
    getParsedMapping(response) {
        return this.getMappingObject(response)
            .extractNested()
            .removedFields()
            .getMapping()
    },
    getMappingObject(response){
        this.indexMapping = objectPath(response, this.getMappingPath());
        return this;
    },
    extractNested(){
        this.indexMapping = objectPath(this.indexMapping, process.env.EXTRA_NESTED_OBJECT);
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
    getMapping() {
        return this.indexMapping;
    },
    getMappingPath(){
        return `body.${process.env.ELASTICSEARCH_INDEX_NAME}.mappings.properties`;
    },
}