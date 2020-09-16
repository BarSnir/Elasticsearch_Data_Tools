const stringUtils = require('../../library/utils/strings');
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
            .getProject(template);
        return template;
    },
    getQuery(req ,template){
        template.query = req.body
        return this;
    },
    addProfile(template) {
        template.query.profile = true;
        return this;
    },
    addQueryNamed(template){
        const rootObject = objectGet(template, 'query.query');
        if(!rootObject){
            return this;
        }
        const queryName = this.getQueryName(rootObject);
        template.name = `${template.index}_${queryName}_${template.name}`;
        return this;
    },
    getIndex(req, template){
        const path = req.path;
        template.index = path.split("/").filter(item => item.length)[0];
        return this;
    },
    getCluster(template){
        template.cluster = process.env.ES_CLUSTER_NAME;
        return this;
    },
    getAgent(template) {
        template.type = "es_profiler_agent";
        return this;
    },
    generateJsonToken(template) {
        template.name = stringUtils.generate_token();
        return this;
    },
    getProject(template){
        template.project = "ES_PROFILER";
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
    }
}