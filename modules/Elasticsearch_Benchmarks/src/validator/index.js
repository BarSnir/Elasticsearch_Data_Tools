const fsUtils = require('../../library/utils/fs');

module.exports = {
    isSearchReq(params){
        for (let key in params) {
            if (params[key] && params[key].includes('search')) {
                return true
            }
        }
        return false;
    },
    isProperStructure(body){
        return this.isProperQueryName(body) || this.isProperAggName(body);
    },
    isProperQueryName(body, r=false){
        if( (!r && !body.query) || !(typeof body == 'object')) return false;
        let answer = false;

        const keys = Object.keys(body);
        for(let i=0; i < keys.length; i++){
            if (keys[i] == "_name" || this.isProperQueryName(body[keys[i]], true) ) {
                answer = true;
                break;
            };
        }
        return answer;
    },
    isProperAggName(body){
        return body.aggs && Objet.keys(body.aggs).length;
    },
    isTypeQueryThresholdExceed(params){
        const jsonFiles = this.getJsonFiles();
        const newFileName = params.fileName;
        const token = params.payload.token;
        const str = newFileName.replace(token, "");
        const threshold = process.env.SEARCH_TYPE_SIZE;
        let counter = 0;

        jsonFiles.forEach((item)=>{
            if(item.includes(str)) counter++
        });
        return counter >= threshold;
    },
    getJsonFiles(){
        return fsUtils.getJsonFiles(`${process.cwd()}/templates/Queries`);
    }
}