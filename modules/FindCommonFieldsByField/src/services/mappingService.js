const elasticRepo = require('../repositories/elasticsearchRepo');
const transformers = require('../transformers')

module.exports = {
    async getIndexMapping() {
        const response = await elasticRepo.getIndexMapping();
        console.log(`Step2: Fetched origin mapping in index named ${process.env.ELASTICSEARCH_INDEX_NAME}. \n`)
        return transformers.getParsedMapping(response);
    }
}