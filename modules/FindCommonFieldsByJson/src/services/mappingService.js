const fsUtil = require('../../../../library/utils/fs')

module.exports = {
    getJson() {
        console.log(this.getJsonPath());
        //return fsUtil.getJsonSync(this.getJsonPath());
    },
    getJsonPath(){
        return `${process.env.PWD}/skeletons/${process.env.JSON_NAME}`;
    }
}