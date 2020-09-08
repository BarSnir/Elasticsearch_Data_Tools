const logger = require('../../../../library/utils/logger')
const objectGet = require('object-path-get');

module.exports = {
    nested_token: null,
    logMessages:{
        a: "Preparing data...\n"
    },
    longDescriptionTypes:{
        FunctionScoreQuery: true
    },
    transformResults(queries, hits){
        logger.log(this.logMessages.a);
        let results = hits.map((hit, index)=>{
            return this.transform(queries[index], hit)
        });
        return [].concat.apply([], results);
    },
    transform(query, hit) {
        const mainQueryStats = this.fetchProfile(hit);
        let results = [];
        const options = {
            results,
            mainQueryStats,
            took: hit.body.took,
            query,
            root: true
        }
        results = this.setQueryResults(options);
        return results;
    },
    fetchQueryType(hit){
        const profileSearchQuery = this.fetchProfile(hit)
        return objectGet(profileSearchQuery[0], 'type');
    },
    setQueryResults(options) {
        let doc = this.getDoc(options);
        doc = this.validateDoc(doc)
        options.results.push(doc);
        
        if (options.mainQueryStats.hasOwnProperty('children')) {
            this.nextChar()
            options.mainQueryStats.children.forEach((query)=> {
                const nestedOptions = {
                    results: options.results,
                    mainQueryStats: query,
                    took: options.took,
                    query: options.query,
                    root: false
                };
                this.setQueryResults(nestedOptions)
            });
        }
        return options.results;
    },
    fetchProfile(hit) {
        const profile = objectGet(hit, 'body.profile.shards');
        const profileSearch = objectGet(profile[0], 'searches');
        return objectGet(profileSearch[0], 'query')[0];
    },
    nanoToMillie(nano){
        return nano / 1000000;
    },
    nextChar() {
        if (!this.nested_token){
            this.nested_token = 'A';
        }
        return String.fromCharCode(this.nested_token.charCodeAt(0) + 1).toUpperCase();
    },
    getDoc(options){
        return {
            query_name: options.query.name,
            project: options.query.project,
            type: options.query.type,
            target_index: options.query.index,
            root_query: options.root,
            took: options.took,
            cluster: options.query.cluster,
            query_time: this.nanoToMillie(options.mainQueryStats.time_in_nanos),
            query_type: options.mainQueryStats.type,
            query_description: options.mainQueryStats.description,
            query_build_scorer_time: this.nanoToMillie(options.mainQueryStats.breakdown.build_scorer),
            query_weight_time: this.nanoToMillie(options.mainQueryStats.breakdown.create_weight),
            query_docs_collect_time: this.nanoToMillie(options.mainQueryStats.breakdown.next_doc),
            query_score_collect_time: this.nanoToMillie(options.mainQueryStats.breakdown.score)
        };
    },
    validateDoc(doc){
        doc.query_description = this.editDocDescription(doc);
        return doc;
    },
    editDocDescription(doc){
        if(!this.longDescriptionTypes.hasOwnProperty(doc.query_type))   
            return doc.query_description

        let str = doc.query_description;
        return str.replace(str.substring(str.indexOf('@'), str.indexOf('@')+9), "");
    }
}