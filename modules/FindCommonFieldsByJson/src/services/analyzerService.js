module.exports = {
    keysPerInspectObj: {},
    keysPerInspectArr: [],
    resultsObj: {},
    analyzeMapping(mappingObject){
        const inspectKeys = this.getInspectKeys();
        return this.analyzeResults(inspectKeys, mappingObject)
    },
    getInspectKeys(){
        return process.env.INSPECT_KEYS.split(",");     
    },
    analyzeResults(inspectKeys, mappingObject){    
        this.getItemsByInspectKey(inspectKeys, mappingObject)
            .resultsToArray(this.keysPerInspectObj)
            .flatNestedArray()
            .filterInspectKeys(inspectKeys)
            .setResultsObj()
            .incrementResultsObj()
            .setBooleanResults(inspectKeys);

        return this.resultsObj
    },
    getItemsByInspectKey(inspectKeys, mappingObject){
        inspectKeys.forEach((key) => {
            this.keysPerInspectObj[key] = Object.keys(mappingObject[key]);
        });
        return this;
    },
    resultsToArray(object){
        this.keysPerInspectArr = Object.entries(object);
        return this;
    },
    flatNestedArray(){
        this.keysPerInspectArr = this.keysPerInspectArr.flat(2);
        return this;
    },
    filterInspectKeys(inspectKeys){
        this.keysPerInspectArr = this.keysPerInspectArr.filter((item) =>{
            return inspectKeys.indexOf(item) === -1
        });
        return this;
    },
    setResultsObj(){
        this.keysPerInspectArr.forEach((item)=>{
            this.resultsObj[item] = 0;
        });
        return this;
    },
    incrementResultsObj(){
        this.keysPerInspectArr.forEach((item)=>{
            this.resultsObj[item]++;
        });
        return this;
    },
    setBooleanResults(inspectKeys){
        for (let key in this.resultsObj){
            this.resultsObj[key] = this.validateResult(
                this.resultsObj[key], 
                inspectKeys
            )
        }
        return this.resultsObj;
    },
    validateResult(count, inspectKeys){
        return count === inspectKeys.length ? true : false;
    }
}