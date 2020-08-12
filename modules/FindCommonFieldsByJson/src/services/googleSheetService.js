const libraryServices = require('../../../../library/services')

module.exports = {
    writeToSheet(payload){
        libraryServices.writeToGoogleSheet(payload)
    }
}