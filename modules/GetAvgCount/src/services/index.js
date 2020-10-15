const elasticRepo = require('../repositories/elasticsearchRepo');
const objectGet = require('object-path-get');

module.exports = {
    hitsPath: 'body.hits.hits',
    getIndexDocs(){
        return elasticRepo.getIndexDocs();
    },
    analyzeAvgFieldsInDocs(docs){
        const hitsArr = this.fetchHits(docs);
        const nestedArrKeys = process.env.NESTED_TO_CHECK.split(',');
        const nestedToCheckCount = nestedArrKeys.length;
        let fieldsCounter = 0;

        hitsArr.forEach((doc)=>{
            fieldsCounter += Object.keys(doc._source).length - nestedToCheckCount;
            for(let i=0; i < nestedArrKeys.length; i++){
                const key = nestedArrKeys[i];
                if(!doc._source[key]) continue;
                fieldsCounter += Object.keys(doc._source[key]).length;
            }
        });


        const avgFields = Math.ceil(fieldsCounter/hitsArr.length);
        return {
            numberOfDocs: hitsArr.length,
            avgFields
        }
    },
    outputToFile(results){
    },
    fetchHits(docs){
        return objectGet(docs, this.hitsPath, []);
    }
}