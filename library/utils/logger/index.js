const timeUtil = require('../time');

module.exports = {
    log(message){
        if(this.showLogs()){
            console.log(`\n [${timeUtil.getLoggerTime()}]  ${message} \n`);
        }
    },
    error(e){
        console.log('\tname: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text);
    },
    showLogs() {
        return (process.env.APP_LOGS).toLowerCase() == 'true' ? true : false;
    }
}