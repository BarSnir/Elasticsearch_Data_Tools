const objectGet = require('object-path-get');

module.exports = {
    transformResults(queries, hits){
        const results = hits.map((hit, index)=>{
            return this.transform(queries[index], hit)
        });
        console.log(results);
    },
    transform(query, hit) {
        return {
            name: query.name,
            took: objectGet(hit,'body.took'),
            ...this.getChildrenType(hit)
        }
    },
    fetchQueryType(hit){
        const profileSearchQuery = this.fetchProfile(hit)
        return objectGet(profileSearchQuery[0], 'type');
    },
    getChildrenType(hit){
        const mainQueryStats = this.fetchProfile(hit);
        const childrenQueries = objectGet(mainQueryStats, 'children');
        let results = {};
        results = this.setMainQueryResults(mainQueryStats)
        childrenQueries.map((child, index)=>{
            results = this.setChildrenResults(child, results, index)
        });
        return results
    },
    setMainQueryResults(mainQueryStats){
        return {
            main_query_stats_time: this.nanoToMillie(mainQueryStats.time_in_nanos),
            main_query_type: mainQueryStats.type,
            main_query_build_scorer_time: this.nanoToMillie(mainQueryStats.breakdown.build_scorer),
            main_query_weight_time: this.nanoToMillie(mainQueryStats.breakdown.create_weight),
            main_query_docs_collect_time: this.nanoToMillie(mainQueryStats.breakdown.next_doc),
            main_query_collect_time: this.nanoToMillie(mainQueryStats.breakdown.score),
        }
    },
    setChildrenResults(child, results, index) {
        const childName = `child_query_${index+1}`;

        results[`${childName}_stats_time`]= this.nanoToMillie(child.time_in_nanos);
        results[`${childName}_type`] = child.type;
        results[`${childName}_description`] = child.description;
        results[`${childName}_build_scorer_time`]= this.nanoToMillie(child.breakdown.build_scorer);
        results[`${childName}_weight_time`] = this.nanoToMillie(child.breakdown.create_weight);
        results[`${childName}_docs_collect_time`] = this.nanoToMillie(child.breakdown.next_doc);
        results[`${childName}_score_collect_time`] = this.nanoToMillie(child.breakdown.score);
        
        return results
    },
    fetchProfile(hit){
        const profile = objectGet(hit, 'body.profile.shards');
        const profileSearch = objectGet(profile[0], 'searches');
        return objectGet(profileSearch[0], 'query')[0];
    },
    nanoToMillie(nano){
        return nano / 1000000;
    }
}