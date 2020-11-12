const logzioClient = require('logzio-nodejs')

module.exports = {
    logger: null,
    initLogzioLogger() {
        this.logger = logzioClient.createLogger({
            token: this.getLogzioToken(),
            type: this.getLogzioType(),
            protocol: this.getLogzioProtocol(),
            host: this.getLogzioHost(),
            port: this.getLogzioPort(),
            debug: this.getDebugOptions()
        });
    },
    getLogzioToken(){
        return process.env.LOGZIO_TOKEN;
    },
    getLogzioType() {
        return process.env.LOGZIO_TYPE;
    },
    getDebugOptions() {
        return process.env.DEBUG_ON || false;
    },
    getLogzioHost(){
        return process.env.LOGZIO_HOST
    },
    getLogzioPort(){
        return process.env.LOGZIO_PORT
    },
    getLogzioProtocol(){
        return process.env.LOGZIO_PROTOCOL
    },
    sendLog(message) {
        this.logger.log(message)
    }
}