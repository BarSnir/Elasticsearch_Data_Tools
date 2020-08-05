const server = require('./server');
const services = require('./src/services')
server.configEnv();

function runModule() {
    const indexMapping = services.getIndexMapping();
}
runModule()