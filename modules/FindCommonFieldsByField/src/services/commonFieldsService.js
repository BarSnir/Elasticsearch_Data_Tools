const elasticRepo = require('../repositories/elasticsearchRepo');
const elasticQueryBuilder = require('../builders/elasticsQueryBuilder');
const fs = require('fs');
const progressBar = require('../../../../library/utils/progressbar')
const transformers = require('../transformers');

module.exports = {
    async find(mappingObj){
        const fieldNames = transformers.getFieldNames(mappingObj);
        const query = elasticQueryBuilder.getQueries(fieldNames);
        const queryChunks = transformers.getQueryChunks(query);;
        const responses = await this.executeQueries(queryChunks);
        fs.appendFileSync('./response.json', JSON.stringify(responses, null ,2));
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