const parsedMappingTransformer = require('./parsedMappingTransformer')

module.exports = {
    getParsedMapping(indexMapping){
        if(!process.env.EXTRA_NESTED_OBJECT) return indexMapping
        console.log(`Step3: Parsing mapping as you asked.\n`)
        return parsedMappingTransformer.getParsedMapping(indexMapping)
    }
}