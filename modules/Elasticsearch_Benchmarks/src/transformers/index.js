const logger = require('../../../../library/utils/logger')
const objectGet = require('object-path-get');

module.exports = {
    nested_token: null,
    logMessages:{
        a: "Preparing data...\n"
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
            name: 'main_query',
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
        options.results.push({
            query_name: options.query.name,
            project: options.query.project,
            type: options.query.type,
            target_index: options.query.index,
            root_query: options.root,
            took: options.took,
            [`${options.name}_stats_time`]: this.nanoToMillie(options.mainQueryStats.time_in_nanos),
            [`${options.name}_type`]: options.mainQueryStats.type,
            [`${options.name}_description`]: options.mainQueryStats.description,
            [`${options.name}_build_scorer_time`]: this.nanoToMillie(options.mainQueryStats.breakdown.build_scorer),
            [`${options.name}_weight_time`]: this.nanoToMillie(options.mainQueryStats.breakdown.create_weight),
            [`${options.name}_docs_collect_time`]: this.nanoToMillie(options.mainQueryStats.breakdown.next_doc),
            [`${options.name}_score_collect_time`]: this.nanoToMillie(options.mainQueryStats.breakdown.score)
        });
        if (options.mainQueryStats.hasOwnProperty('children')) {
            this.nextChar()
            options.mainQueryStats.children.forEach((query, index)=> {
                const nestedOptions = {
                    name: `nested_query_${this.nested_token+(index+1)}`,
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
    }
}