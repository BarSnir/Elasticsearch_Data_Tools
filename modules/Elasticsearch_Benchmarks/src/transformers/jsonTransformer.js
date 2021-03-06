const stringUtils = require('../../library/utils/strings');
const timeUtils = require('../../library/utils/time');
const objectGet =require('object-path-get');

module.exports = {
    transformReqToJson(req){
        const template = {};
        this.getQuery(req, template)
            .addProfile(template)
            .getIndex(req, template)
            .getCluster(template)
            .getAgent(template)
            .generateJsonToken(template)
            .addQueryNamed(template)
            .addAggName(template)
            .getProject(template)
            .storeDate(template);
        return template;
    },
    getQuery(req ,template){
        template.query = req.body
        return this;
    },
    addProfile(template) {
        if(!template.query) return this;
        template.query.profile = true;
        return this;
    },
    addQueryNamed(template){
        const rootObject = objectGet(template, 'query.query', null);
        
        if(!rootObject){
            return this;
        }
        const queryName = this.getQueryName(rootObject);
        template.name = `query_${template.index}_${queryName}_${template.name}`;
        return this;
    },
    addAggName(template){
        if (template.name.includes("query_")) return this;
        const aggName = this.getAggregationName(template.query);
        template.name = `aggregation_${template.index}_${aggName}_${template.name}`;
        return this
    },  
    getIndex(req, template){
        const path = req.path;
        template.index = path.split("/").filter(item => item.length)[0];
        return this;
    },
    getCluster(template){
        if(!process.env.ES_CLUSTER_NAME) return this;
        template.cluster = process.env.ES_CLUSTER_NAME;
        return this;
    },
    getAgent(template) {
        template.type = "es_profiler_agent";
        return this;
    },
    generateJsonToken(template) {
        template.name = stringUtils.generate_token();
        template.token = template.name;
        return this;
    },
    getProject(template){
        template.project = process.env.project || "ES_PROFILER";
        return this;
    },
    getQueryName(object){
        let queryName = '';
        const nestedKeys = Object.keys(object);
        for (let i = 0; i < nestedKeys.length; i++){
            let key = nestedKeys[i]
            if(key === '_name'){
                queryName = object[key]
                break;
            }

            if( Object.keys(object[key]).length) {
                queryName = this.getQueryName(object[key])
            }
        }
        return queryName;
    },
    getAggregationName(queryObject){
        return Object.keys(queryObject.aggs)[0]
    },
    storeDate(template){
        template.storeTime = timeUtils.getCurrentDate();
        return this;
    }
}