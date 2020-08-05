require('./server').configEnv()

function runModule() {
    console.log(process.env.ELASTICSEARCH_HOST);
}

runModule()