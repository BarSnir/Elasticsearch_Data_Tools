const objectPath = require('object-path-get');
const elasticRepo = require('../repositories/elasticsearchRepo');


module.exports = {
    async getIndexMapping() {
        const response = await elasticRepo.getIndexMapping();
        console.log(`Step2: Fetched origin mapping in index named ${process.env.ELASTICSEARCH_INDEX_NAME}. \n`)
        return objectPath(response, this.getMappingPath());
    },
    getMappingPath(){
        return `body.${process.env.ELASTICSEARCH_INDEX_NAME}.mappings.properties`;
    },
}