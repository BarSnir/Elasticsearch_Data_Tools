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
        d: 'Step5: Results been transformed, uploading to Logzio.\n'
    },
    removeDeprecatedQueries(){
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
    transformRequestQuery(req, res){
        if(!validator.isSearchReq(req.params, req.body)){
            res.send(this.getMessage('e01'));
            return;
        } 
        const payload = transformers.transformsQueryToJson(req);
        const path = this.getJsonsDirPath();
        const fileName = payload.name;
        const params = {
            payload,
            path,
            fileName
        }
        if (validator.isTypeQueryThresholdExceed(params)){
            res.send(this.getMessage('e02'))
            return;
        }
        fs.writeJsonToPath(params);
        res.send(this.getMessage('success'));
    },
    transmitResults(results){
        logger.log(this.logMessage.d);
        results.forEach((object)=>{
            logzioClient.sendLog(object);
        });
    },
    getJsonsDirPath(){
        return `${process.cwd()}/templates/Queries`;
    },
    getMessage(messageKey){
        const messages = {
            success: "Query saved\n",
            e01: 'This is not search request\n',
            e02: `This type of query appears ${process.env.SEARCH_TYPE_SIZE} times. Query didn't saved to filesystem. \n`,
        }
        return messages[messageKey];
    }
}