const aggregationResultsService = require('./aggregationResultsService');
const analyzeResultsService = require('./aggregationAnalyzerService');
const mappingService = require('./mappingService');
const googlesheetService = require('./googlesheetService');

module.exports = {
    getIndexMapping(){
        return mappingService.getIndexMapping();
    },
    getAggregationResults(mappingObj){
        return aggregationResultsService.getAggregationResults(mappingObj);
    },
    analyzeResults(aggregationResults){
        return analyzeResultsService.analyze(aggregationResults);
    },
    sendToGoogleSheets(analyzedResults){
        googlesheetService.writeToSheet(analyzedResults)
    }
}