const dotenv = require('dotenv');
const path = require('path');
const elasticRepo = require('./repositories/elasticsearchRepo');
const logzioClient = require('../library/connectors/logzio')
const logger = require('../library/utils/logger');
const app = require('express');
const bodyParser = require('body-parser');
const router = require('../src/router');

module.exports = {
    env: 'development',
    env_path: '../.env',
    logMessages:{
        a: `Module's server is listen on port`,
        b:`Connection establish by Elastic cloud.\n`,
        c: `Logzio connector established\n`
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
        elasticRepo.initializeECConnection();
        logger.log(this.logMessages.b);
        logzioClient.initLogzioLogger();
        logger.log(this.logMessages.c);
    }
}