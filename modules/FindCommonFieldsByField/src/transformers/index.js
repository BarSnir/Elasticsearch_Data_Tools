const parsedMappingTransformer = require('./parsedMappingTransformer');
const fieldNamesTransformer = require('./fieldNamesTransformer');

module.exports = {
    getParsedMapping(indexMapping){
        if(!process.env.EXTRA_NESTED_OBJECT) return indexMapping
        console.log(`Step3: Parsing mapping as you asked.\n`)
        return parsedMappingTransformer.getParsedMapping(indexMapping)
    },
    getFieldNames(mappingObj){
        console.log(`Step4: Preparing data to initialize in query.\n`);
        return fieldNamesTransformer.getFieldNames(mappingObj);
    }
}