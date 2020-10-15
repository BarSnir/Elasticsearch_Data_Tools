const logger = require('../../library/utils/logger');
const server = require('./src/server');
const services = require('./src/services');
server.configEnv().configRepo();

async function runModule() {
    const docs = await services.getIndexDocs();
    const results = await services.analyzeAvgFieldsInDocs(docs);
    logger.log(`Result: Average fields in ${results.numberOfDocs} is ${results.avgFields} in index ${process.env.ELASTICSEARCH_INDEX_NAME}`)
}
runModule()