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
    configRepo(elasticsearchClusterType){
        if(!elasticsearchClusterType) return ;
        switch(elasticsearchClusterType) {
            case "source-cloud": {
                try {
                    elasticRepo.initECConnectionSource();
                    logger.log(`From source Elasticsearch ${this.logMessages.b}`);
                } catch (err) {
                    throw new Error("From source Elasticsearch, Something went wrong with Elastic cloud connection.")
                }
                break;
            }
            case "source-on-prem": {
                try {
                    elasticRepo.initESConnectionSource();
                    logger.log(`From source Elasticsearch ${this.logMessages.d}`);
                } catch (err) {
                    throw new Error(`From source Elasticsearch, Something went wrong with Elasticsearch on-prem connection.\n ${err}`)
                }
                break;
            }
            case "target-cloud": {
                try {
                    elasticRepo.initECConnectionTarget();
                    logger.log(`From target Elasticsearch ${this.logMessages.b}`);
                } catch (err) {
                    throw new Error("From target Elasticsearch, Something went wrong with Elastic cloud connection.")
                }
                break;
            }
            case "target-on-prem": {
                try {
                    elasticRepo.initESConnectionTarget();
                    logger.log(`From target Elasticsearch ${this.logMessages.d}`);
                } catch (err) {
                    throw new Error(`From target Elasticsearch, Something went wrong with Elasticsearch on-prem connection.\n ${err}`)
                }
                break;
            }
        }
        logzioClient.initLogzioLogger();
        logger.log(this.logMessages.c);
        return this;
    }
}