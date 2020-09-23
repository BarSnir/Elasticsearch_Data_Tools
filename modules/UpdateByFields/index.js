const server = require('./src/server');
const services = require('./src/services');
const runModule = require('./src/services');

server.configEnv().configRepo();

(() => {
    services.runModule();
})()