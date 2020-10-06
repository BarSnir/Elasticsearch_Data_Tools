const elasticConnector = require('../../library/connectors/elasticsearch');
const logger = require('../../library/utils/logger');

module.exports = {
    elasticClient: null,
    logMessages:{
        a:`Step1: Initializing server\n`
    },
    initializeECConnection() {
        this.elasticClient = elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID,
            username: process.env.ELASTIC_CLOUD_USER,
            password: process.env.ELASTIC_CLOUD_PASSWORD
        });
        logger.log(this.logMessages.a)
    },
    initializeESConnection() {
        this.elasticClient = elasticConnector.getEsClient(
            process.env.ELASTICSEARCH_ON_PREM_SOURCE
        )
        logger.log(this.logMessages.a)
    },
    executeQuery(query, index) {
        return this.elasticClient.search({
            index: index,
            body: query
        });
    },
    initializeTargetCluster(){
        
    },
    executeBulk(body){
        return this.elasticClientTarget.bulk({
            body,
            refresh: true
        });
    }
}