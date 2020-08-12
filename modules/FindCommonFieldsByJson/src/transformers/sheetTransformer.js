
module.exports = {
    rows: [],
    structGoogleSheet(results){
        for(let key in results) {
            this.rows.push({
                field_name: key,
                isCommonField: results[key]
            })
        }
        return this.rows;
    }
}