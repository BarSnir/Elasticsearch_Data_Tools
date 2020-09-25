const elasticConnector = require('../../../../library/connectors/elasticsearch');
const logger = require('../.../../../../../library/utils/logger');
const fs = require('fs');

module.exports = {
    elasticClient: null,
    logMessages:{
        a:`Step1: Connected to Elasticsearch.`
    },
    initializeECConnection() {
        this.elasticClient = elasticConnector.getEcClient({
            id: process.env.ELASTIC_CLOUD_ID,
            username: process.env.ELASTIC_CLOUD_USER,
            password: process.env.ELASTIC_CLOUD_PASSWORD
        });
        logger.log(this.logMessages.a)
    },
    getIndexMapping(){
        return this.elasticClient.indices.getMapping({
            index: process.env.ELASTICSEARCH_INDEX_NAME,
            include_type_name: process.env.ELASTICSEARCH_TYPE_INCLUDED,
        });
    },
    preformMsSearch(query){
        return this.elasticClient.msearch({
            body: query
        });
    },
    search(indexName, query){
        return this.elasticClient.search({
            index: indexName,
            size: 1000,
            body: query
        });
    },
    firstScrollSearch(indexName ,query){
        return this.elasticClient.search({
            index: indexName,
            scroll: process.env.SCROLL_TIME,
            size: 1000,
            body: query
        });
    },
    scrollSearch(scrollId){
        return this.elasticClient.scroll({
            scrollId: scrollId,
            scroll: process.env.SCROLL_TIME
        })
    },
    bulk(bulk){
        return this.elasticClient.bulk({
            refresh: true,
            body: bulk
        });   
    }
}