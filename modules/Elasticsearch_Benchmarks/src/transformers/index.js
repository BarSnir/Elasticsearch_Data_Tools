const reportTransformer = require("./reportTransformer");
const jsonTransformer = require("./jsonTransformer");

module.exports = {
    getResults(queries, hits) {
        return reportTransformer.transformResults(queries, hits);
    },
    transformsQueryToJson(req){
        return jsonTransformer.transformReqToJson(req);
    }
}