const aggregationResultsService = require('./aggregationResultsService');
const analyzeResultsService = require('./aggregationAnalyzerService');
const mappingService = require('./mappingService');
const GS = require('google-spreadsheet');
const creds = require('../../credentials.json')

module.exports = {
    getIndexMapping(){
        return mappingService.getIndexMapping();
    },
    getAggregationResults(mappingObj){
        return aggregationResultsService.getAggregationResults(mappingObj);
    },
    analyzeResults(aggregationResults){
        return analyzeResultsService.analyze(aggregationResults);
        /**
         * {
         *  filedName: string
         *  categories: string
         *  isCommon: boolean
         * }
         */
    },
    async createNewGoogleSheet(){

    },
    async updateSheets(){
        const  doc = new GS.GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo(); // loads document properties and worksheets
        //await doc.addSheet({ title: 'hot new sheet!' }); //TAB add
        const sheet = await doc.addSheet({ headerValues: ['field_name', 'categories'], title: "Common_Fields" });
        const larryRow = await sheet.addRow({ field_name: 'Larry Page', categories: 'larry@google.com' });
    }
}