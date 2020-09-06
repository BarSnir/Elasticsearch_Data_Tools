const fsUtil = require('../../../../library/utils/fs');
const elasticRepo = require('../repositories/elasticsearchRepo');

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
    getResults(hits){},
    transmitResults(results){},
    getJsonsDirPath(){
        return `${process.cwd()}/templates/Queries`;
    }
}