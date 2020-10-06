const dotenv = require('dotenv');
const path = require('path');
const elasticRepo = require('./repositories/elasticsearchRepo');
const logzioClient = require('../library/connectors/logzio')
const logger = require('../library/utils/logger');
const app = require('express');
const router = require('../src/router');

module.exports = {
    env: 'development',
    env_path: '../.env',
    logMessages:{
        a: `Module's server is listen on port`,
        b: `Connection establish by Elastic cloud.\n`,
        c: `Logzio connector established\n`,
        d: `Connection establish by Elasticsearch On-prem.\n`
    },
    configCWD(){
        process.chdir(__dirname);
        return this;
    },
    configEnv(){
        dotenv.config({path:path.resolve(__dirname, this.env_path)});
        return this;
    },
    configServer(){
        let server = app();
        server.use(router);
        server.listen(process.env.PORT, ()=>{
            logger.log(`${this.logMessages.a} ${process.env.PORT}`)
        });
        return this;
    },
    configRepo(){
        switch(process.env.SOURCE_ELASTICSEARCH) {
            case "cloud": {
                try {
                    elasticRepo.initializeECConnection();
                    logger.log(this.logMessages.b);
                } catch (err) {
                    throw new error("Something went wrong with Elastic cloud connection.")
                }
                break;
            }
            case "on-prem": {
                try {
                    elasticRepo.initializeESConnection();
                    logger.log(this.logMessages.d);
                } catch (err) {
                    throw new error("Something went wrong with Elasticsearch on-prem connection.")
                }
                break;
            }
        }
        logzioClient.initLogzioLogger();
        logger.log(this.logMessages.c);
    }
}