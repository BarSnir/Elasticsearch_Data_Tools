const dotenv = require('dotenv');
const path = require('path');
const elasticRepo = require('./repositories/elasticsearchRepo');
const logger = require('./../../../library/utils/logger');

module.exports = {
    env: "development",
    logMessages:{
        a:`Connection establish by Elastic cloud.\n`,
    },
    configEnv(){
        dotenv.config({path:path.resolve(__dirname, '../.env')});
    },
    configRepo(){
        elasticRepo.initializeECConnection();
        logger.log(this.logMessages.a)
    }
}