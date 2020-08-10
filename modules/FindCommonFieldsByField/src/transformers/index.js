const parsedMappingTransformer = require('./parsedMappingTransformer');
const fieldNamesTransformer = require('./fieldNamesTransformer');
const queryChunkTransformer = require('./queryChunkTransformer');
const logger = require('../.../../../../../library/utils/logger')


module.exports = {
    logMessages:{
        a:`Step3: Parsing mapping as you asked.\n`,
        b:`Step4: Preparing data to initialize in query.\n`,
        c:`Step6: Splitting the query to chunks.\n`,
    },
    getParsedMapping(indexMapping){
        if(!process.env.EXTRA_NESTED_OBJECT) return indexMapping
        logger.log(this.logMessages.a)
        return parsedMappingTransformer.getParsedMapping(indexMapping)
    },
    getFieldNames(mappingObj){
        logger.log(this.logMessages.b)
        return fieldNamesTransformer.getFieldNames(mappingObj);
    },
    getQueryChunks(query){
        logger.log(this.logMessages.c)
        return queryChunkTransformer.getQueryChunks(query)
    }
}