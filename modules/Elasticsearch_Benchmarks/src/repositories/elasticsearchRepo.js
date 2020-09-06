const elasticConnector = require('../../../../library/connectors/elasticsearch');
const logger = require('../.../../../../../library/utils/logger');

module.exports = {
    elasticClient: null,
    logMessages:{
        a:`Step1: Connected to Elasticsearch.\n`
    },
    initializeECConnection() {
        this.elasticClient = elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID,
            username: process.env.ELASTIC_CLOUD_USER,
            password: process.env.ELASTIC_CLOUD_PASSWORD
        });
        logger.log(this.logMessages.a)
    },
    executeQuery(query) {
        return this.elasticClient.search({
            index: process.env.ELASTICSEARCH_INDEX_NAME,
            body: query
        });
    }
}