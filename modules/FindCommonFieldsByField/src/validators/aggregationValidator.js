module.exports = {
    validationObj: {},
    validate(aggregationObj){
        this.setValidationObj();
        this.validateBuckets(aggregationObj);
        return this.getValidation();
    },
    setValidationObj(){
        const keys = process.env.COMMON_ARR.split(",");
        keys.forEach((key)=>{
            this.validationObj[key] = false;
        });
    },
    validateBuckets(aggregationObj) {
        const keys = process.env.COMMON_ARR.split(",");
        const firstKey = Object.keys(aggregationObj)[0];
        const firstObject = aggregationObj[firstKey];
        const firstBuckets = firstObject.buckets;
        const keysSubBuckets = {};
        firstBuckets.forEach((item)=>{
            const key = item.key;
            const subBuckets = item.value_sample.buckets;
            keysSubBuckets[parseInt(key)] = subBuckets;
        });
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
    getValidation(){
        for(let key in this.validationObj){
            if(!this.validationObj[key]) return false;
        }
        return true;
    }
}