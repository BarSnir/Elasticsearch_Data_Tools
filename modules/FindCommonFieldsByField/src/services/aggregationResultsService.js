const elasticRepo = require('../repositories/elasticsearchRepo');
const elasticQueryBuilder = require('../builders/elasticsQueryBuilder');
const logger = require('../../../../library/utils/logger');
const progressBar = require('../../../../library/utils/progressbar');
const transformers = require('../transformers');

module.exports = {
    logMessages:{
        a: `Step7: Getting aggregation results.\n`
    },
    barColor: null,
    barMessage: null,
    defaultBarMSG: "Progress running.",
    defaultBarColor: "cyan",
    async getAggregationResults(mappingObj){
        this.updateProgressBarOptions()
        const fieldNames = transformers.getFieldNames(mappingObj);
        const query = elasticQueryBuilder.getQueries(fieldNames);
        const queryChunks = transformers.getQueryChunks(query);
        logger.log(this.logMessages.a)
        return this.executeQueries(queryChunks);
    },
    async executeQueries(queryChunks){
        const responses = []
        let counter = 0;
        this.runProgressBar(queryChunks)

        while(counter < queryChunks.length) {
            let queryBulk = queryChunks[counter];
            let response = await elasticRepo.preformMsSearch(queryBulk);
            this.sleep(process.env.MSEARCH_INTERVAL)
            progressBar.increase()
            responses.push(response.body)
            counter++
        }

        progressBar.stop()
        return responses;
    },
    runProgressBar(queryChunks){
        progressBar.construct(this.barColor, this.barMessage);
        progressBar.start(queryChunks.length)
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    updateProgressBarOptions(){
        this.barColor = process.env.ELASTICSEARCH_PROGRESS_BAR_COLOR || this.defaultBarColor;
        this.barMessage = process.env.ELASTICSEARCH_PROGRESS_BAR_MSG || this.defaultBarMSG
    }
}