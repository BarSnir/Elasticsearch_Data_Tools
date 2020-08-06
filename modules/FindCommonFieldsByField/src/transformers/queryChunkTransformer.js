module.exports = {
    getQueryChunks(query){
        var i,j,tempArray,chunk = 10;
        for (i=0,j=query.length; i<j; i+=chunk) {
            tempArray = query.slice(i,i+chunk);
            // do whatever
        }
    }
}