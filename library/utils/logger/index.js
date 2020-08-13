const timeUtil = require('../time');

module.exports = {
    log(message){
        console.log(`[${timeUtil.getLoggerTime()}]  ${message}`);
    },
    error(e){
        console.log('\tname: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text);
    }
}