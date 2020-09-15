const stringUtils = require('../../library/utils/strings');

module.exports = {
    transformReqToJson(req){
        const template = {};
        this.getQuery(req, template)
            .addProfile(template)
            .getIndex(req, template)
            .getCluster(template)
            .getAgent(template)
            .generateJsonToken(template)
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
    getIndex(req, template){
        const path = req.path;
        template.index = path.split("/").filter(item => item.length)[0]
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
    }

}