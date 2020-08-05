const { Client } = require('@elastic/elasticsearch');

module.exports = {
    getEsClient(host){
        return new Client({
            node: host
        });
    },
    getEcClient(cloudAuthObject){
        const {id, username, password} = cloudAuthObject;
        return new Client({
            cloud: {
                id
            },
            auth: {
                username,
                password,
            }
        })
    }
}