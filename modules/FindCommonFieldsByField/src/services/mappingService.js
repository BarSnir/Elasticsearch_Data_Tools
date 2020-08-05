const objectPath = require('object-path-get');
const server = require('../../server');

module.exports = {
    async getIndexMapping() {
        const ecClient = server.getECConnection();
        console.log(`Step1: Connected to Elasticsearch.\n`);
        const response = await ecClient.indices.getMapping({
            index: process.env.ELASTICSEARCH_INDEX_NAME,
            include_type_name: process.env.ELASTICSEARCH_TYPE_INCLUDED,
        });
        console.log(`Step2: Fetched origin mapping in index named ${process.env.ELASTICSEARCH_INDEX_NAME}. \n`)
        return objectPath(response, this.getMappingPath());
    },
    getMappingPath(){
        return `body.${process.env.ELASTICSEARCH_INDEX_NAME}.mappings.properties`;
    },
}