const dotenv = require('dotenv');
const path = require('path');
const elasticRepo = require('./repositories/elasticsearchRepo');

module.exports = {
    env: "development",
    configEnv(){
        dotenv.config({path:path.resolve(__dirname, '../.env')});
    },
    configRepo(){
        elasticRepo.initializeECConnection();
        console.log(`Connection establish by Elastic cloud.\n`);
    }
}