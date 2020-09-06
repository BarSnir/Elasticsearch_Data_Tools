const server = require('./src/server');
const services = require('./src/services')

server.configCWD().configEnv().configRepo();

async function runModule() {
    const queries = services.getProfilerQueries();
    const hits = await services.executeQueries(queries);
    const results = services.getResults(hits);
    services.transmitResults(results)
}
runModule()