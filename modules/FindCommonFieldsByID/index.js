const server = require('./server');
server.configEnv();

function runModule() {
    const ecClient = server.getECConnection();
}
runModule()