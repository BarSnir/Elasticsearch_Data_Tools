const fsUtil = require('../../../../library/utils/fs');
const elasticRepo = require('../repositories/elasticsearchRepo');
const transformers = require('../transformers')
const logger = require('../../../../library/utils/logger');
const logzioClient = require('../../../../library/connectors/logzio')

module.exports = {
    logMessage:{
        a: 'Step2: Collecting json query files.\n',
        b: 'Step3: Collected json query files, Executing queries against Elasticsearch.\n',
        c: 'Step4: Got profiled queries results, now transforming them.\n',
        d: 'Step5: Results been transformed, uploading to Logzio.\n'
    },
    getProfilerQueries(){
        logger.log(this.logMessage.a);
        let jsonsFiles = fsUtil.getJsonFiles(this.getJsonsDirPath());
        jsonsFiles = jsonsFiles.map(item => `${this.getJsonsDirPath()}/${item}`);
        return jsonsFiles.map(item => fsUtil.getJsonSync(item));
    },
    executeQueries(queries){
        logger.log(this.logMessage.b);
        const promises = queries.map((queryObj)=>{
            return elasticRepo.executeQuery(queryObj.query, queryObj.index);
        });
        return Promise.all(promises)
    },
    getResults(queries, hits){
        logger.log(this.logMessage.c);
        return transformers.transformResults(queries, hits);
    },
    transmitResults(results){
        logger.log(this.logMessage.d);
        results.forEach((object)=>{
            logzioClient.sendLog(object);
        })
    },
    getJsonsDirPath(){
        return `${process.cwd()}/templates/Queries`;
    }
}