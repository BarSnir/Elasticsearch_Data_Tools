const dotenv = require('dotenv');
const elasticConnector = require('../../library/connectors/elasticsearch');
const path = require('path');

module.exports = {
    env: "development",
    configEnv(){
        dotenv.config({path:path.resolve(__dirname, '.env')});
    },
    getECConnection() {
        return elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID,
            username: process.env.ELASTIC_CLOUD_USER,
            password: process.env.ELASTIC_CLOUD_PASSWORD
        });
    }
}