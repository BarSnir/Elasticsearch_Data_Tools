const findCommonFieldsService = require('./findCommonFieldsService');
const mappingService = require('./mappingService');

module.exports = {
    getIndexMapping(){
        return mappingService.getIndexMapping();
    },
    findCommonFields(mappingObj){
        return findCommonFieldsService.find(mappingObj);
    }
}