const elasticConnector = require('../../../../library/connectors/elasticsearch');

module.exports = {
    getECConnection() {
        return elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID,
            username: process.env.ELASTIC_CLOUD_USER,
            password: process.env.ELASTIC_CLOUD_PASSWORD
        });
    }
}