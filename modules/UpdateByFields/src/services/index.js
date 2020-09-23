const elasticRepo = require('../repositories/elasticsearchRepo');
const objectGet = require('object-path-get');
const query = require('../../queries/query.json');
const fs  = require('fs');


const services = {
    hitsPath: 'body.hits.hits',
    termsQueryLimit: 1024,
    counter: 0,
    completeCount: 0,
    async runModule(scrollId=false) {
        let sourceRes;
        if(scrollId){
            sourceRes = await elasticRepo.scrollSearch(scrollId);
        } else {
            sourceRes = await elasticRepo.firstScrollSearch(
                process.env.SOURCE_INDEX,
                query
            );
        }
        if(!(objectGet(sourceRes, this.hitsPath)).length){
            process.exit(0);
        }
        const docObject = this.generateDocumentsId(
            objectGet(sourceRes, this.hitsPath)
        );

        
        const targetQuery = this.generateTargetQuery(docObject);
        const firstTargetRes = await elasticRepo.search(
            process.env.TARGET_INDEX,
            targetQuery
        );
        const arrangedObj = await this.arrangeObj(
            objectGet(firstTargetRes, this.hitsPath),
            docObject
        );

        const bulk = await this.generateBulk(arrangedObj);
        //await elasticRepo.bulk(bulk);
        console.log(`Bulk No. ${this.counter++} with bulk length ${bulk.length/2}`);
        if(sourceRes.body._scroll_id){
            this.runModule(sourceRes.body._scroll_id)
        }
    },
    generateDocumentsId(documents){
        const documentIdsObj = {};
        documents.forEach((item)=>{
            let documentId =  this.fetchId(item);
            documentIdsObj[documentId] = {
                src: item._source
            }
        });
        return documentIdsObj;
    },
    fetchId(item){
        const uniqueFieldsArr = process.env.FIELDS_FOR_ID.split(",");
        const length = uniqueFieldsArr.length;
        const source = item['_source'] || item;
        let id = '';
        uniqueFieldsArr.forEach((key, index) => {
            id+=source[key];
            id += (index+1 < length)? '_' : '';
        });
        return id;
    },
    generateTargetQuery(ids){
        if (Object.keys(ids).length > this.termsQueryLimit) {
            throw new Error(
                `Can generate terms query up to 1024 terms, go ${Object.keys(ids).length}`
            );
        }
        return {
            query:{
                terms:{
                    [process.env.TARGET_FIELD]: Object.keys(ids)
                }
            }
        }
    },
    arrangeObj(destDocs, srcKeysObj){
        const changedFieldsArr = process.env.FIELDS_TO_CHANGE.split(','); 
        destDocs.forEach((doc) => {
            let key = doc._source[process.env.TARGET_FIELD];
            for(let i=0; i < changedFieldsArr.length; i++){
                let destDoc = doc._source;
                let srcDoc = srcKeysObj[key].src;
                let destId = doc._id;
                if(destDoc[changedFieldsArr[i]] == srcDoc[changedFieldsArr[i]] ){
                    console.log(`complete ${this.completeCount++}`);
                    continue;
                }
                destDoc[changedFieldsArr[i]] = srcDoc[changedFieldsArr[i]];
                srcKeysObj[key]['dest'] = destDoc;
                srcKeysObj[key]['dest_id'] = destId;
            }
        });
        return srcKeysObj;
    },
    async generateBulk(arrangedObj){
        const bulk = [];
        for (let k in arrangedObj) {
            const item = arrangedObj[k];
            if(!item.dest){
                
                let id = this.fetchId(item.src);
                let dest = await elasticRepo.search(
                             process.env.TARGET_INDEX,
                             {
                                query:{
                                    term:{
                                        [process.env.TARGET_FIELD]: id
                                    }
                                }
                            }
                        );
                if(!objectGet(dest, this.hitsPath)[0]){
                    continue;
                }
                item.dest = objectGet(dest, this.hitsPath)[0]['_source'];
                item.dest_id = objectGet(dest, this.hitsPath)[0]['_id']
                console.log(`Applying assistance for id: ${item.dest_id}`);
            }
            const bulkDirection = { update: { 
                _index: process.env.TARGET_INDEX,
                _type: "_doc",
                _id: item.dest_id
                } 
            }
            const document = {doc:item.dest};
            bulk.push(bulkDirection, document);
        }
        return bulk;
    }
}

module.exports = services