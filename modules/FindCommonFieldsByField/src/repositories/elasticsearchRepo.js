const elasticConnector = require('../../../../library/connectors/elasticsearch');

module.exports = {
    elasticClient: null,
    initializeECConnection() {
        this.elasticClient = elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID,
            username: process.env.ELASTIC_CLOUD_USER,
            password: process.env.ELASTIC_CLOUD_PASSWORD
        });
        console.log(`Step1: Connected to Elasticsearch.\n`);
    },
    getIndexMapping(){
        return this.elasticClient.indices.getMapping({
            index: process.env.ELASTICSEARCH_INDEX_NAME,
            include_type_name: process.env.ELASTICSEARCH_TYPE_INCLUDED,
        });
    },
    preformMsSearch(query){
        return this.elasticClient.msearch({
            body: query
        });
    }
}