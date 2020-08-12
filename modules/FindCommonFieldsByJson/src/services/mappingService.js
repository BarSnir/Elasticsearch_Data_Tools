const fsUtil = require('../../../../library/utils/fs')

module.exports = {
    getJson() {
        return fsUtil.getJsonSync(this.getJsonPath());
    },
    getJsonPath(){
        return `${process.env.PWD}/skeletons/${process.env.JSON_NAME}`;
    }
}