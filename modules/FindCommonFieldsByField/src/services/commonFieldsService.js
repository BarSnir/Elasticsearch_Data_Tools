const elasticRepo = require('../repositories/elasticsearchRepo');
const elasticQueryBuilder = require('../builders/elasticsQueryBuilder');
const fs = require('fs');
const transformers = require('../transformers');

module.exports = {
    async find(mappingObj){
        const fieldNames = transformers.getFieldNames(mappingObj);
        const query = elasticQueryBuilder.getQueries(fieldNames);
        const response = await elasticRepo.preformMsSearch(query);
        fs.appendFileSync('./response.json', JSON.stringify(response.body, null ,2));
    }
}