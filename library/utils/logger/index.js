const timeUtil = require('../time');

module.exports = {
    log(message){
        if(this.showLogs()){
            console.log(`[${timeUtil.getLoggerTime()}]  ${message}`);
        }
    },
    error(e){
        console.log('\tname: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text);
    },
    showLogs() {
        return (process.env.APP_LOGS).toLowerCase() == 'true' ? true : false;
    }
}