const elasticRepo = require('../repositories/elasticsearchRepo');
const transformers = require('../transformers');
const logger = require('../.../../../../../library/utils/logger')


module.exports = {
    logMessages:{
        a:`Step2: Fetched origin mapping in index named`
    },
    async getIndexMapping() {
        const response = await elasticRepo.getIndexMapping();
        logger.log(`${this.logMessages.a}. \n`)
        return transformers.getParsedMapping(response);
    }
}