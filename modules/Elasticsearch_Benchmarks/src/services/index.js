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
        const promises = queries.map((query)=>{
            return elasticRepo.executeQuery(query);
        });
        return Promise.all(promises)
    },
    getResults(hits){
        return transformers.transformResults(hits);
    },
    transmitResults(results){},
    getJsonsDirPath(){
        return `${process.cwd()}/templates/Queries`;
    }
}