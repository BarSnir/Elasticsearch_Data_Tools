const aggregationResultsService = require('./aggregationResultsService');
const mappingService = require('./mappingService');

module.exports = {
    getIndexMapping(){
        return mappingService.getIndexMapping();
    },
    getAggregationResults(mappingObj){
        return aggregationResultsService.getAggregationResults(mappingObj);
    },
    analyzeResults(aggregationResults){
        
    }
}