const googleSheetService = require('./googleSheetService')

module.exports = {
    writeToGoogleSheet(payload){
        googleSheetService.writeToSheet(payload)
    }
}