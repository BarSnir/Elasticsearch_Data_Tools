const fsUtil = require('../../library/utils/fs');
const elasticRepo = require('../repositories/elasticsearchRepo');
const transformers = require('../transformers')
const logger = require('../../library/utils/logger');
const logzioClient = require('../../library/connectors/logzio');
const validator = require('../validator');
const fs = require('../../library/utils/fs');
const timeUtils = require('../../library/utils/time');

module.exports = {
    logMessage:{
        a: 'Step2: Collecting json query files.\n',
        b: 'Step3: Collected json query files, Executing queries against Elasticsearch.\n',
        c: 'Step4: Got profiled queries results, now transforming them.\n',
        d: 'Step5: Results been transformed, Bulking to concrete client.\n'
    },
    collectRequestQuery(req, res){
        const payload = transformers.transformsQueryToJson(req);
        const path = this.getJsonsDirPath();
        const fileName = payload.name;
        const params = {
            payload,
            path,
            fileName
        }
        if (validator.isTypeQueryThresholdExceed(params)){
            const str = `This type of query appears ${process.env.SEARCH_TYPE_SIZE} times. Query didn't saved to filesystem.`;
            res.send(str).status(400);
            return;
        }
        fs.writeJsonToPath(params);
        res.send('query saved');
    },
    removeOldQueries(){
        const path = this.getJsonsDirPath();
        const jsonsFiles = fsUtil.getJsonFiles(path);
        for (let i = 0; i < jsonsFiles.length; i++){
            const template = fsUtil.getJsonSync(`${path}/${jsonsFiles[i]}`);
            if (!template.hasOwnProperty('storeTime')) continue;
            
            const fileNeedToBeRemoved = timeUtils.isDurationExceed(template.storeTime);
            if(fileNeedToBeRemoved){
                const params = {
                    fileName: jsonsFiles[i],
                    path
                }
                fsUtil.removeFile(params);
            }
        }
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
        const bulksTargetArr = process.env.CLIENT_TYPE.split(",");
        bulksTargetArr.forEach((item)=>{
            this[`${item}Bulk`](results)
        });
    },
    logzioBulk(results){
        results.forEach((object)=>{
            //logzioClient.sendLog(object);
        });
    },
    elasticsearchBulk(results){
        const bulk = [];
        let indexName = process.env.PROFILER_INDEX_NAME;
        indexName += `-${timeUtils.getCurrentDate()}`;
        results.forEach((result)=>{
            bulk.push({
                index: { 
                    _index: indexName,
                    _type: process.env.PROFILER_TYPE_NAME 
                }
            });
            bulk.push(result);
        });
        
    },
    getJsonsDirPath(){
        return `${process.cwd()}/templates/Queries`;
    }
}