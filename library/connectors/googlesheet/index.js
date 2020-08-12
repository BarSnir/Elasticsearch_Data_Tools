const GS = require('google-spreadsheet');
const creds = require('./credentials.json');

module.exports = {
    docClient: null,
    sheetInfo:null,
    sheet:null,
    sheetInit(){
        this.docClient = new GS.GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        return this;
    },
    sheetAuth(){
        this.docClient.useServiceAccountAuth(creds);
    },
    async loadInfo(){
        await this.docClient.loadInfo(); 
        return this.docClient;
    },
    async addSheet(options, name){
        return await this.docClient.addSheet(options, name);
    },
}