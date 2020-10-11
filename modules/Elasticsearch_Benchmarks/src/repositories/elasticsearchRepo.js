const elasticConnector = require('../../library/connectors/elasticsearch');
const logger = require('../../library/utils/logger');

module.exports = {
    elasticClient: null,
    logMessages:{
        a:`Step1: Initializing server\n`
    },
    initECConnectionSource() {
        this.elasticClient = elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID_SOURCE,
            username: process.env.ELASTIC_CLOUD_USER_SOURCE,
            password: process.env.ELASTIC_CLOUD_PASSWORD_SOURCE
        });
        logger.log(this.logMessages.a)
    },
    initESConnectionSource() {
        this.elasticClient = elasticConnector.getEsClient(
            process.env.ELASTICSEARCH_ON_PREM_SOURCE
        )
        logger.log(this.logMessages.a)
    },
    initECConnectionTarget() {
        this.elasticClientTarget = elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID_SOURCE,
            username: process.env.ELASTIC_CLOUD_USER_SOURCE,
            password: process.env.ELASTIC_CLOUD_PASSWORD_SOURCE
        });
    },
    initESConnectionTarget() {
        this.elasticClientTarget = elasticConnector.getEsClient(
            process.env.ELASTICSEARCH_ON_PREM_TARGET
        );
    },
    executeQuery(query, index) {
        return this.elasticClient.search({
            index: index,
            body: query
        });
    },
    executeBulkToTarget(body){
        return this.elasticClientTarget.bulk({
            body,
            refresh: true
        });
    }
}