const dotenv = require('dotenv');
const path = require('path');
const elasticRepo = require('./repositories/elasticsearchRepo');
const logzioClient = require('../../../library/connectors/logzio')
const logger = require('./../../../library/utils/logger');

module.exports = {
    env: 'development',
    env_path: '../.env',
    logMessages:{
        a:`Connection establish by Elastic cloud.\n`,
        b:`Logzio connector established\n`
    },
    configCWD(){
        process.chdir(__dirname);
        return this;
    },
    configEnv(){
        dotenv.config({path:path.resolve(__dirname, this.env_path)});
        return this;
    },
    configRepo(){
        elasticRepo.initializeECConnection();
        logger.log(this.logMessages.a);
        logzioClient.initLogzioLogger();
        logger.log(this.logMessages.b);
    }
}