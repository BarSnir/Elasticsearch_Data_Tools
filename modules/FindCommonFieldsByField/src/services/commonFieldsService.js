const elasticRepo = require('../repositories/elasticsearchRepo');
const elasticQueryBuilder = require('../builders/elasticsQueryBuilder')
const transformers = require('../transformers');

module.exports = {
    find(mappingObj){
        const fieldNames = transformers.getFieldNames(mappingObj);
        const query = elasticQueryBuilder.getQueries(fieldNames)
        
    }
}