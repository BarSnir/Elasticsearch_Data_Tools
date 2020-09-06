const fsUtil = require('../../../../library/utils/fs');
const elasticRepo = require('../repositories/elasticsearchRepo');
const transformers = require('../transformers')

module.exports = {
    getProfilerQueries(){
        let jsonsFiles = fsUtil.getJsonFiles(this.getJsonsDirPath());
        jsonsFiles = jsonsFiles.map(item => `${this.getJsonsDirPath()}/${item}`);
        return jsonsFiles.map(item => fsUtil.getJsonSync(item));
    },
    executeQueries(queries){
        const promises = queries.map((queryObj)=>{
            return elasticRepo.executeQuery(queryObj.query);
        });
        return Promise.all(promises)
    },
    getResults(queries, hits){
        return transformers.transformResults(queries, hits);
    },
    transmitResults(results){},
    getJsonsDirPath(){
        return `${process.cwd()}/templates/Queries`;
    }
}