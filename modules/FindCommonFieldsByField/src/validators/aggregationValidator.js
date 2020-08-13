module.exports = {
    validationObj: {},
    runValidate(aggregationObj){
        this.setValidationObj();
        this.prepareBucketsValidation(aggregationObj);
        return this.validate();
    },
    setValidationObj(){
        const keys = process.env.COMMON_ARR.split(",");
        keys.forEach((key)=>{
            this.validationObj[key] = false;
        });
    },
    prepareBucketsValidation(aggregationObj) {
        const fieldName = Object.keys(aggregationObj)[0];
        const extractedAggregation = aggregationObj[fieldName];
        const firstBuckets = extractedAggregation.buckets;
        const keysSubBuckets = this.getKeySubBuckets(firstBuckets);
        this.setValidationValues(keysSubBuckets)
    },
    getKeySubBuckets(firstBuckets) {
        const keysSubBuckets = {};
        firstBuckets.forEach((item)=>{
            const key = item.key;
            const subBuckets = item.value_sample.buckets;
            keysSubBuckets[parseInt(key)] = subBuckets;
        });
        return keysSubBuckets
    },
    setValidationValues(keysSubBuckets) {
        const keys = process.env.COMMON_ARR.split(",");
        for ( i=0; i < keys.length; i++){
            if (!keys[i]) break;
            const chosenKey = keys[i];
            if (!keysSubBuckets.hasOwnProperty(chosenKey)) continue;
            const bucketArr = keysSubBuckets[chosenKey]
            bucketArr.forEach((item)=>{
                if(item.key !== ''){
                    this.validationObj[chosenKey] = true
                }
            });
        }
    },
    validate(){
        for(let key in this.validationObj){
            if(!this.validationObj[key]) return false;
        }
        return true;
    }
}