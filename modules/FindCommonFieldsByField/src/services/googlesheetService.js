const creds = require('../../credentials.json');
const progressBar = require('../../../../library/utils/progressbar');
const googlesheet = require('../../../../library/connectors/googlesheet');
const logger = require('../../../../library/utils/logger');

module.exports = {
    sheetOptions:{
        headerValues:[
            'field_name',
            'commonFieldValues', 
            'isCommonField',    
        ],
        title:"Common_Fields",
    },
    barColor:"cyan",
    barMessage: "Uploading data to google sheet.",
    googleSheetQuotaInterval: 1000,
    async writeToSheet(analyzedResults){
        try {
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
        googlesheet.sheetInit().sheetAuth(creds);
    }
}