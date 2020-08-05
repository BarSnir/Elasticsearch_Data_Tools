const mappingService = require('./mappingService');

module.exports = {
    getIndexMapping(){
        return mappingService.getIndexMapping()
    }
}