const server = require('./src/server');
const services = require('./src/services')

server.configCWD()
    .configEnv()
    .configServer()
    .configRepo(process.env.SOURCE_ELASTICSEARCH_TYPE)
    .configRepo(process.env.TARGET_ELASTICSEARCH_TYPE);

async function runModule() {
    services.removeOldQueries()
    const queries = services.getProfilerQueries();
    const hits = await services.executeQueries(queries);
    const results = services.getResults(queries, hits);
    services.transmitResults(results);
}

runModule();
setInterval(runModule, parseInt(process.env.SAMPLE_PERIOD));