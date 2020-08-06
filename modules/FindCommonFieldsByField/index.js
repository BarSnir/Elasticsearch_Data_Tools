const server = require('./server');
const services = require('./src/services')
const transformers = require('./src/transformers')
server.configEnv();

async function runModule() {
    const indexMapping = await services.getIndexMapping();
    const mappingObj = transformers.getParsedMapping(indexMapping);
    const commonFields = await services.findCommonFields(mappingObj);

}
runModule()