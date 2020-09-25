const elasticRepo = require('../repositories/elasticsearchRepo');
const objectGet = require('object-path-get');
const query = require('../../queries/query.json');
const logger = require('../../../../library/utils/logger');
const progressBar = require('../../../../library/utils/progressbar');

const services = {
    hitsPath: 'body.hits.hits',
    defaultBarMSG: "Progress running.",
    defaultBarColor: "blue",
    termsQueryLimit: 1024,
    counter: 0,
    completeCount: 0,
    logMessage:{
        a:`There is no more items to scroll on.`,
        b:`Bulks can take a while, application still running...`
    },
    async runModule(scrollId=false) {
        const sourceRes = await this.sourceSearch(scrollId);
        const sourceDocs = (objectGet(sourceRes, this.hitsPath));
        if(!sourceDocs.length) this.closeProcess()

        const sourceDestObj = this.generateDocumentsId(sourceDocs);
        const destIndexQuery = this.generateTargetQuery(sourceDestObj);
        const targetRes = await elasticRepo.search(
            process.env.TARGET_INDEX,
            destIndexQuery
        );
        const arrangedObj = await this.arrangeObj(
            objectGet(targetRes, this.hitsPath),
            sourceDestObj
        );
        const bulk = await this.generateBulk(arrangedObj);
        await elasticRepo.bulk(bulk);
        progressBar.increase();
        this.runModule(sourceRes.body._scroll_id);
    },
    async sourceSearch(scrollId){
        if(scrollId) return elasticRepo.scrollSearch(scrollId);
        const res = await elasticRepo.firstScrollSearch(
            process.env.SOURCE_INDEX,
            query
        );
        logger.log(this.logMessage.b)
        this.runProgressBar(res.body.hits.total); 
        return res
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
            let item = arrangedObj[k];
            if(!item.dest){
                item = await this.getSingleItem(item);
                if(!item.dest_id){
                    continue;
                }
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
    },
    async getSingleItem(item) {
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
        let destDoc = objectGet(dest, this.hitsPath)[0]
        if (!destDoc) {
            item.dest = [];
            return item;
        } 
        item.dest = destDoc['_source'];
        item.dest_id = destDoc['_id'];
        return item;
    },
    runProgressBar(total){
        this.barColor = process.env.ELASTICSEARCH_PROGRESS_BAR_COLOR || this.defaultBarColor;
        this.barMessage = process.env.ELASTICSEARCH_PROGRESS_BAR_MSG || this.defaultBarMSG;
        progressBar.construct(this.barColor, this.barMessage);
        progressBar.start(Math.ceil(total/1000));
    },
    closeProcess(){
        logger.log(this.logMessage.a);
        progressBar.stop();
        process.exit(0);
    }
}

module.exports = services