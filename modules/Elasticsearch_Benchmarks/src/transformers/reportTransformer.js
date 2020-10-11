const logger = require('../../library/utils/logger');
const timeUtils = require('../../library/utils/time')
const objectGet = require('object-path-get');

module.exports = {
    logMessages:{
        a: "Preparing data...\n"
    },
    longDescriptionTypes:{
        FunctionScoreQuery: true
    },
    transformResults(queries, hits){
        logger.log(this.logMessages.a);
        let results = [];
        hits.forEach((hit, index)=>{
            results.push(this.transformSearchStats(queries[index], hit));
            results.push(this.transformAggsStats(queries[index], hit));
            results.push(this.transformCollectorsStats(queries[index], hit));
        });
        results = [].concat.apply([], results);
        return results.filter(item => Object.keys(item).length);
    },
    transformSearchStats(query, hit) {
        const options = this.getSearchDocOptions(query, hit, true);
        options.results = [];
        results = this.setQueryResults(options);
        return results;
    },
    getSearchDocOptions(query, hit, isRootQuery){
        const mainQueryStats = this.fetchSearchProfile(hit);
        const method = "getSearchDoc";
        return {
            mainQueryStats,
            took: hit.body.took,
            query,
            root: isRootQuery,
            method,
            edit: true
        }
    },
    transformAggsStats(query, hit){
        const options = this.getAggsDocOptions(query, hit, true);
        if (!options.mainQueryStats) return {}
        options.results = []
        results = this.setQueryResults(options);
        return results;
    },
    getAggsDocOptions(query, hit, isRootQuery){
        const mainQueryStats = this.fetchAggsProfile(hit);
        const method = "getAggsDoc";
        return {
            mainQueryStats,
            took: hit.body.took,
            query,
            root: isRootQuery,
            method,
            edit: false
        }
    },
    transformCollectorsStats(query, hit){
        const options = this.getCollectorsDocOptions(query, hit, true);
        if (!options.mainQueryStats) return {}
        options.results = []
        results = this.setQueryResults(options);
        return results;
    },
    getCollectorsDocOptions(query, hit, isRootQuery){
        const mainQueryStats = this.fetchCollectorsProfile(hit);
        const method = "getCollectorDoc";
        return {
            mainQueryStats,
            took: hit.body.took,
            query,
            root: isRootQuery,
            method,
            edit: false
        }
    },
    setQueryResults(options) {
        let doc = this[options.method](options);
        doc = this.validateDoc(doc, options);
        options.results.push(doc);

        if (options.mainQueryStats.hasOwnProperty('children')) {
            options.mainQueryStats.children.forEach((query)=> {
                const nestedOptions = this.getNestedDocOptions(options, query);
                this.setQueryResults(nestedOptions)
            });
        }
        return options.results;
    },
    fetchSearchProfile(hit) {
        const profile = objectGet(hit, 'body.profile.shards');
        const profileSearch = objectGet(profile[0], 'searches');
        return objectGet(profileSearch[0], 'query')[0];
    },
    fetchAggsProfile(hit) {
        const profile = objectGet(hit, 'body.profile.shards');
        return objectGet(profile[0], 'aggregations')[0];
    },
    fetchCollectorsProfile(hit){
        const profile = objectGet(hit, 'body.profile.shards');
        const profileSearch = objectGet(profile[0], 'searches');
        return objectGet(profileSearch[0], 'collector')[0];
    },
    getNestedDocOptions(options, query){
        return {
            results: options.results,
            mainQueryStats: query,
            took: options.took,
            query: options.query,
            root: false,
            method: options.method,
            edit: options.edit 
        };
    },
    nanoToMillie(nano){
        return nano / 1000000;
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
            profiler_timestamp: timeUtils.getTimestamp(),
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
            profiler_timestamp: timeUtils.getTimestamp(),
            query_section: "aggregation",
            aggregation_time: this.nanoToMillie(options.mainQueryStats.time_in_nanos),
            aggregation_type: options.mainQueryStats.type,
            aggregation_description: options.mainQueryStats.description,
            aggregation_build_aggregation_time: this.nanoToMillie(
                options.mainQueryStats.breakdown.build_aggregation
            ),
            aggregation_initialize_time: this.nanoToMillie(
                options.mainQueryStats.breakdown.initialize
            ),
            aggregation_docs_collect_time: this.nanoToMillie(
                options.mainQueryStats.breakdown.collect
            ),
        };
    },
    getCollectorDoc(options){
        return {
            query_name: options.query.name,
            project: options.query.project,
            type: options.query.type,
            target_index: options.query.index,
            root_collector: options.root,
            took: options.took,
            cluster: options.query.cluster,
            profiler_timestamp: timeUtils.getTimestamp(),
            query_section: "collector",
            collector_time: this.nanoToMillie(options.mainQueryStats.time_in_nanos),
            collector_type: options.mainQueryStats.reason,
            collector_name: options.mainQueryStats.name
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