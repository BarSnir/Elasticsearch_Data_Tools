const dotenv = require('dotenv');
const path = require('path');
const logzioClient = require('../library/connectors/logzio')
const logger = require('../library/utils/logger');
const app = require('express');

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
        server.listen(process.env.PORT || 8080, ()=>{
            logger.log(`${this.logMessages.a} ${process.env.PORT || 8080}`)
        });
        return this;
    },
}