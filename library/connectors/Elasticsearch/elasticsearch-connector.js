const { Client } = require('@elastic/elasticsearch');

module.export = {
    getEsClient(host){
        return new Client({
            node: host
        });
    }
}