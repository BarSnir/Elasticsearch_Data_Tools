const commonFieldsService = require('./commonFieldsService');
const mappingService = require('./mappingService');

module.exports = {
    getIndexMapping(){
        return mappingService.getIndexMapping();
    },
    findCommonFields(mappingObj){
        return commonFieldsService.find(mappingObj);
    }
}