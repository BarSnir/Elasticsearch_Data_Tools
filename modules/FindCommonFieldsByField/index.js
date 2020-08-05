const server = require('./server');
const services = require('./src/services')
const transformers = require('./src/transformers')
server.configEnv();

async function runModule() {
    const indexMapping = await services.getIndexMapping();
    const mappingObj = transformers.getParsedMapping(indexMapping);
    console.log(mappingObj);
}
runModule()