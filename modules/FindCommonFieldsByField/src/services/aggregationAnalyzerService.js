module.exports = {
    sheetData: [],
    analyze(aggregationResults) {
        let responses = [];
        aggregationResults.forEach((obj)=>{
            responses.push(...obj.responses);
        });
        responses = responses.map((obj)=> obj.aggregations)
        responses.forEach((obj)=> {
            let fieldName = this.getFieldName(obj);
            let commonFieldValues = this.getCommonFieldValues(obj[fieldName]);
            let isCommonField = this.checkCommonField(commonFieldValues);
            this.sheetData.push({
                fieldName,
                commonFieldValues,
                isCommonField,
            });
        });
        return this.sheetData;
    },
    getFieldName(obj){
        return Object.keys(obj)[0]; 
    },
    getCommonFieldValues(obj) {
        const buckets = obj.buckets;
        let keys = "";
        buckets.forEach((bucket,index)=> {
            let str = index+1 === buckets.length ? "" : ",";
            keys += bucket.key+str
        });
        return keys;
    },
    checkCommonField(str) {
        const commonArr = process.env.COMMON_ARR.split(",");
        let isCommonField = true;
        let current = str.split(",");
        if ((current.length != commonArr.length)) return false;
        return isCommonField;
    }
}