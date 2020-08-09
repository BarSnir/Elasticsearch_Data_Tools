const fs = require('fs');

module.exports ={
    writeJson(fileName, payload){
        fs.appendFileSync(`./${fileName}.json`, JSON.stringify(payload, null ,2));
    }
}