module.exports = {
    isSearchReq(params){
        for (let key in params) {
            if (params[key] && params[key].includes('search')) {
                return true
            }
        }
        return false;
    }
}