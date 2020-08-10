const GS = require('google-spreadsheet');

module.exports = {
    docClient: null,
    sheetInfo:null,
    sheet:null,
    sheetInit(){
        this.docClient = new GS.GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        return this;
    },
    sheetAuth(creds){
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