const progressBar = require('../../../../library/utils/progressbar');
const googlesheet = require('../../../../library/connectors/googlesheet');
const logger = require('../../../../library/utils/logger');

module.exports = {
    sheetOptions:{
        headerValues:[
            'field_name',
            'isCommonField',    
        ],
        title: null,
    },
    barColor:"green",
    barMessage: " Uploading data to google sheet.",
    googleSheetQuotaInterval: 2500,
    async writeToSheet(analyzedResults){
        try {
            this.updateSheetTitle();
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
    updateSheetTitle(){
        this.sheetOptions.title = process.env.GOOGLE_SHEET_TAB_NAME
    }
}