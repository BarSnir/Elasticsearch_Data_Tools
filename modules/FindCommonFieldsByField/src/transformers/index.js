const parsedMappingTransformer = require('./parsedMappingTransformer');
const queryTransformer = require('./queryTransformer');

module.exports = {
    getParsedMapping(indexMapping){
        if(!process.env.EXTRA_NESTED_OBJECT) return indexMapping
        console.log(`Step3: Parsing mapping as you asked.\n`)
        return parsedMappingTransformer.getParsedMapping(indexMapping)
    },
    getQuery(mappingObj){
        console.log(`Step4: Preparing data to initialize in query.\n`);
        return queryTransformer.getQuery(mappingObj);
    }
}