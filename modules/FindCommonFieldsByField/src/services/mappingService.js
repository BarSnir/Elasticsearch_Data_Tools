const server = require('../../server');

module.exports = {
    async getIndexMapping() {
        const ecClient = server.getECConnection();
        const indexMapping = await ecClient.indices.getMapping({
            index: process.env.ELASTICSEARCH_INDEX_NAME,
            include_type_name: process.env.ELASTICSEARCH_TYPE_INCLUDED,
        });
        console.log(indexMapping);
    }
}