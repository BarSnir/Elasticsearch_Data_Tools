const logger = require('../../../../library/utils/logger')
const objectGet = require('object-path-get');

module.exports = {
    nested_token: null,
    logMessages:{
        a: "Preparing data...\n"
    },
    transformResults(queries, hits){
        logger.log(this.logMessages.a);
        return hits.map((hit, index)=>{
            return this.transform(queries[index], hit)
        });
    },
    transform(query, hit) {
        return {
            name: query.name,
            project: query.project,
            took: objectGet(hit,'body.took'),
            ...this.getProfiles(hit)
        }
    },
    getProfiles(hit){
        const mainQueryStats = this.fetchProfile(hit);
        let results = {};
        results = this.setQueryResults('main_query', results, mainQueryStats)
        return results
    },
    fetchQueryType(hit){
        const profileSearchQuery = this.fetchProfile(hit)
        return objectGet(profileSearchQuery[0], 'type');
    },
    setQueryResults(name, results, query) {
        results[`${name}_stats_time`] = this.nanoToMillie(query.time_in_nanos);
        results[`${name}_type`] = query.type;
        results[`${name}_description`] = query.description;
        results[`${name}_build_scorer_time`]= this.nanoToMillie(query.breakdown.build_scorer);
        results[`${name}_weight_time`] = this.nanoToMillie(query.breakdown.create_weight);
        results[`${name}_docs_collect_time`] = this.nanoToMillie(query.breakdown.next_doc);
        results[`${name}_score_collect_time`] = this.nanoToMillie(query.breakdown.score);

        if (query.hasOwnProperty('children')) {
            this.nextChar()
            query.children.forEach((query, index)=> {
                this.setQueryResults(`nested_query_${this.nested_token+(index+1)}`, results, query)
            });
        }
        return results;
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