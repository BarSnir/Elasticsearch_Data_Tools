const mappingService = require('./mappingService')

module.exports = {
    getMappingJson(){
        return mappingService.getJson()
    }
}