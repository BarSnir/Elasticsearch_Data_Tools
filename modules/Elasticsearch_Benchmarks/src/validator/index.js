module.exports = {
    isSearchReq(params, body){
        for (let key in params) {
            if (params[key] && params[key].includes('search') && Object.keys(body).length) {
                return true
            }
        }
        return false;
    }
}