const server = require('./server');
const services = require('./src/services')
server.configEnv();
server.configRepo();

async function runModule() {
    const mappingObj = await services.getIndexMapping();
    const aggregationResults = await services.getAggregationResults(mappingObj);
    const analyzedResults = services.analyzeResults(aggregationResults);
}
runModule()