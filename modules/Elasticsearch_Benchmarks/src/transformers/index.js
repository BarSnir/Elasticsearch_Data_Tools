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
        results = [].concat.apply([], results);
        hits.map((hit, index)=>{
           results.push(this.transformAggs(queries[index], hit)) 
        });
        console.log(results);
        process.exit(0)
        return results;
    },
    transform(query, hit) {
        const mainQueryStats = this.fetchProfile(hit);
        let results = [];
        const options = {
            results,
            mainQueryStats,
            took: hit.body.took,
            query,
            root: true,
            method: "getSearchDoc",
            edit: true
        }
        results = this.setQueryResults(options);
        return results;
    },
    transformAggs(query, hit){
        const mainAggsStats = this.fetchAggsProfile(hit);
        if(!mainAggsStats) return {}

        let results = [];
        const options = {
            results,
            mainQueryStats:mainAggsStats,
            took: hit.body.took,
            query,
            root: true,
            method: "getAggsDoc",
            edit: false
        }
        results = this.setQueryResults(options);
        return results;
    },
    setQueryResults(options) {
        const method = options.method;
        let doc = this[method](options);
        doc = this.validateDoc(doc, options);
        options.results.push(doc);
        
        if (options.mainQueryStats.hasOwnProperty('children')) {
            this.nextChar()
            options.mainQueryStats.children.forEach((query)=> {
                const nestedOptions = {
                    results: options.results,
                    mainQueryStats: query,
                    took: options.took,
                    query: options.query,
                    root: false,
                    method: options.method,
                    edit: options.edit 
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
    fetchAggsProfile(hit) {
        const profile = objectGet(hit, 'body.profile.shards');
        return objectGet(profile[0], 'aggregations')[0];
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
    getSearchDoc(options){
        return {
            query_name: options.query.name,
            project: options.query.project,
            type: options.query.type,
            target_index: options.query.index,
            root_query: options.root,
            took: options.took,
            cluster: options.query.cluster,
            query_section: "query",
            query_time: this.nanoToMillie(options.mainQueryStats.time_in_nanos),
            query_type: options.mainQueryStats.type,
            query_description: options.mainQueryStats.description,
            query_build_scorer_time: this.nanoToMillie(options.mainQueryStats.breakdown.build_scorer),
            query_weight_time: this.nanoToMillie(options.mainQueryStats.breakdown.create_weight),
            query_docs_collect_time: this.nanoToMillie(options.mainQueryStats.breakdown.next_doc),
            query_score_collect_time: this.nanoToMillie(options.mainQueryStats.breakdown.score)
        };
    },
    getAggsDoc(options){
        return {
            aggregation_name: options.query.name,
            project: options.query.project,
            type: options.query.type,
            target_index: options.query.index,
            root_aggregation: options.root,
            took: options.took,
            cluster: options.query.cluster,
            query_section: "aggregation",
            aggregation_time: this.nanoToMillie(options.mainQueryStats.time_in_nanos),
            aggregation_type: options.mainQueryStats.type,
            aggregation_description: options.mainQueryStats.description,
            aggregation_build_scorer_time: this.nanoToMillie(options.mainQueryStats.breakdown.build_scorer),
            aggregation_weight_time: this.nanoToMillie(options.mainQueryStats.breakdown.create_weight),
            aggregation_docs_collect_time: this.nanoToMillie(options.mainQueryStats.breakdown.next_doc),
            aggregation_score_collect_time: this.nanoToMillie(options.mainQueryStats.breakdown.score)
        };
    },
    validateDoc(doc, options) {
        if(!options.edit) return doc;

        doc.query_description = this.editDocDescription(doc);
        return doc;
    },
    editDocDescription(doc){
        if(!this.longDescriptionTypes.hasOwnProperty(doc.query_type))   
            return doc.query_description

        let str = doc.query_description;
        return str.replace(str.substring(str.indexOf('@'), str.indexOf('}')+1), "");
    }
}