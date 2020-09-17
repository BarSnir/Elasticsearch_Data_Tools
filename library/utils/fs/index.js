const fs = require('fs');

module.exports = {
    jsonExt: '.json',
    getJsonSync(path){
        return JSON.parse(fs.readFileSync(path));
    },
    writeJson(fileName, payload){
        fs.appendFileSync(`./${fileName}.json`, JSON.stringify(payload, null ,2));
        console.log(`File wrote to ${fileName}.json`);
    },
    getJsonFiles(path){
        return fs.readdirSync(path).filter(fn => fn.endsWith(this.jsonExt));
    },
    removeFile(params){
        fs.unlinkSync(params.path)
        logger.log(`File ${params.fileName}.json removed from ${params.path}`);
    }
}