const elasticRepo = require('../repositories/elasticsearchRepo');
const elasticQueryBuilder = require('../builders/elasticsQueryBuilder');
const progressBar = require('../../../../library/utils/progressbar')
const transformers = require('../transformers');

module.exports = {
    async getAggregationResults(mappingObj){
        const fieldNames = transformers.getFieldNames(mappingObj);
        const query = elasticQueryBuilder.getQueries(fieldNames);
        const queryChunks = transformers.getQueryChunks(query);
        console.log(`Step7: Getting aggregation results.\n`);
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
        progressBar.construct(
            "cyan",
            " Query chunks No."
        );
        progressBar.start(queryChunks.length)
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}