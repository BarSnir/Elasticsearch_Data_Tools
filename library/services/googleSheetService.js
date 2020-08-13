const progressBar = require('../utils/progressbar');
const googlesheet = require('../connectors/googlesheet');
const logger = require('../utils/logger');

module.exports = {
    sheetOptions:{
        headerValues:[],
        title: null,
    },
    barColor: null,
    barMessage: null,
    googleSheetQuotaInterval: 2000,
    defaultBarMSG: "Progress running.",
    defaultBarColor: "cyan",
    async writeToSheet(analyzedResults){
        try {
            this.updateSheetOptions().updateProgressBarOptions();
            await this.authSheet()
            this.startBar(analyzedResults.length);
            const sheet = await googlesheet.addSheet(this.sheetOptions);
            this.writeByQuota(analyzedResults, sheet)
        } catch(e) {
            progressBar.stop()
            logger.error(e)
        }
    },
    writeByQuota(payload, sheet){
        let counter = 0;
        const t = setInterval(async()=> {
            try {
                if (counter >= payload.length){
                    clearInterval(t)
                    progressBar.stop()
                    process.exit(0);
                }
                await sheet.addRow(payload[counter]);
                counter++
                progressBar.increase()
            } catch(e) {
                logger.error(e)
            }

        }, this.googleSheetQuotaInterval);
    },
    startBar(count){
        progressBar.construct(this.barColor , this.barMessage)
        progressBar.start(count);
    },
    authSheet(){
        googlesheet.sheetInit().sheetAuth();
    },
    updateSheetOptions(){
        this.sheetOptions.title = process.env.GOOGLE_SHEET_TAB_NAME;
        this.sheetOptions.headerValues = process.env.GOOGLE_SHEET_HEADERS.split(",");
        return this;
    },
    updateProgressBarOptions(){
        this.barColor = process.env.SHEETS_PROGRESS_BAR_COLOR || this.defaultBarColor;
        this.barMessage = process.env.SHEETS_PROGRESS_BAR_MSG || this.defaultBarMSG
    }
}