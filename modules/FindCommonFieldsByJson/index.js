const server = require('./src/server');
const services = require('./src/services')
server.configEnv();

function runModule() {
    const mappingObj = services.getMappingJson();
    const analyzedResults = services.analyzeMapping(mappingObj);
    services.sendToGoogleSheets(analyzedResults);
}
runModule()