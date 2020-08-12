const fs = require('fs');

module.exports = {
    getJsonSync(path){
        return fs.readFileSync(path);
    },
    writeJson(fileName, payload){
        fs.appendFileSync(`./${fileName}.json`, JSON.stringify(payload, null ,2));
    }
}