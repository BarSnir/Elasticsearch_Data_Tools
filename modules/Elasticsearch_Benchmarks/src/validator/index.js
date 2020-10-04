const fsUtils = require('../../library/utils/fs');

module.exports = {
    isSearchReq(params, body){
        for (let key in params) {
            if (params[key] && params[key].includes('search') && this.gotProperQueryStructure(body)) {
                return true
            }
        }
        return false;
    },
    isTypeQueryThresholdExceed(params){
        const jsonFiles = fsUtils.getJsonFiles(`${process.cwd()}/templates/Queries`);
        const newFileName = params.fileName;
        const token = params.payload.token;
        console.log(params);
        const str = newFileName.replace(token, "");
        const threshold = process.env.SEARCH_TYPE_SIZE;
        let counter = 0;

        jsonFiles.forEach((item)=>{
            if(item.includes(str)) counter++
        });

        return counter >= threshold;
    },
    gotProperQueryStructure(body){
        const properQueryStructure = (body.hasOwnProperty("query") || body.hasOwnProperty("aggs"));
        const notEmptyQuery = (body.query && Object.keys(body.query).length) ? true : false;
        const notEmptyAgg = (body.aggs && Object.keys(body.aggs).length) ? true : false;
        return properQueryStructure && (notEmptyQuery || notEmptyAgg);
    }
}