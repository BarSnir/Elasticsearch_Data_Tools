const server = require('./src/server');
const LogzioLogger = require('../../library/connectors/logzio');
server.configEnv();
server.configRepo();

async function runModule() {
    LogzioLogger.sendLog("Benchmark application");
}
runModule()