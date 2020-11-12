const server = require('./src/server');
// const services = require('./src/services')

server.configCWD()
    .configEnv()
    .configServer();
    
async function runModule() {

}

runModule();
setInterval(runModule, parseInt(process.env.SAMPLE_PERIOD));