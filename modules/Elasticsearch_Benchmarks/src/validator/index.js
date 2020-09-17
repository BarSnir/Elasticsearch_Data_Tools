const fsUtils = require('../../library/utils/fs');

module.exports = {
    isSearchReq(params, body){
        for (let key in params) {
            if (params[key] && params[key].includes('search') && Object.keys(body).length) {
                return true
            }
        }
        return false;
    },
    isTypeQueryThresholdExceed(params){
        
        const jsonFiles = fsUtils.getJsonFiles(`${process.cwd()}/templates/Queries`);
        const newFileName = params.fileName;
        const token = params.payload.token;
        const str = newFileName.replace(token, "");
        const threshold = process.env.SEARCH_TYPE_SIZE;
        let counter = 0;

        jsonFiles.forEach((item)=>{
            if(item.includes(str)) counter++
        });

        return counter >= threshold;
    }
}