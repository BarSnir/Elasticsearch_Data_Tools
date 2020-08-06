const elasticRepo = require('../repositories/elasticsearchRepo');
const transformers = require('../transformers');

module.exports = {
    find(mappingObj){
        const query = transformers.getQuery(mappingObj);
        
    }
}