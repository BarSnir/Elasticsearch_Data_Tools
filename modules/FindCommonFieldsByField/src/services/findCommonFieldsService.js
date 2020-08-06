const elasticClient = require('../repositories/elasticsearch')

module.exports = {
    find(mappingObj){
        const ecClient = elasticClient.getECConnection();
        
        console.log(mappingObj);
    }
}