const server = require('./src/server');
const LogzioLogger = require('../../library/connectors/logzio');
server.configEnv();
server.configRepo();

function runModule() {
    LogzioLogger.sendLog("Benchmark application");
}
runModule()