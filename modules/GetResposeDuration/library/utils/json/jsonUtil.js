module.exports = {
    getFreshCopy(obj){
        return JSON.parse(JSON.stringify(obj));
    }
}