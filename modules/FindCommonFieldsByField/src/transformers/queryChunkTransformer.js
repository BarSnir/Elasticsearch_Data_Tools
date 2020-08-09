module.exports = {
    getQueryChunks(query){
        var i,j,chunk = 10;
        const queryChunks = [];
        for (i=0,j=query.length; i<j; i+=chunk) {
            let tempArray = query.slice(i,i+chunk);
            queryChunks.push(tempArray);
        }
        return queryChunks
    }
}