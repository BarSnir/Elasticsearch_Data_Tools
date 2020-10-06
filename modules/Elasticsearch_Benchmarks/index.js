const server = require('./src/server');
const services = require('./src/services')

server.configCWD()
    .configEnv()
    .configServer()
    .configRepo();

async function runModule() {
    services.removeOldQueries()
    const queries = services.getProfilerQueries();
    const hits = await services.executeQueries(queries);
    const results = services.getResults(queries, hits);
    services.transmitResults(results);
}

runModule();
setInterval(runModule, process.env.SAMPLE_PERIOD);