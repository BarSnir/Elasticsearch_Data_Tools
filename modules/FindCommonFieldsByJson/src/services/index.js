const mappingService = require('./mappingService');
const analyzerService = require('./analyzerService');
const googleSheetService = require('./googleSheetService');
const sheetTransformer = require('../transformers/sheetTransformer');

module.exports = {
    getMappingJson(){
        return mappingService.getJson();
    },
    analyzeMapping(mappingObj){
        const resultsObj = analyzerService.analyzeMapping(mappingObj);
        return sheetTransformer.structGoogleSheet(resultsObj);
    },
    sendToGoogleSheets(results){
        googleSheetService.writeToSheet(results)
    }
}