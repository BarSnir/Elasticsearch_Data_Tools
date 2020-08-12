const server = require('./src/server');
const services = require('./src/services')
server.configEnv();
server.configRepo();

async function runModule() {
    const mappingObj = await services.getIndexMapping();
    const aggregationResults = await services.getAggregationResults(mappingObj);
    const analyzedResults = services.analyzeResults(aggregationResults);
    await services.sendToGoogleSheets(analyzedResults);
}
runModule()