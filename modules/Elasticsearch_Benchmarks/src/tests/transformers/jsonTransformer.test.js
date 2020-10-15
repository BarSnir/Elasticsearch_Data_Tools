const chai = require('chai');
const expect = chai.expect;
const jsonTransformer = require('../../transformers/jsonTransformer');
const timeUtils = require('../../../library/utils/time');


describe('getQuery', ()=>{
    it('should return query',()=>{
        //assign
        const request = getRequestMock();
        const template = {};
        //action
        jsonTransformer.getQuery(request, template);
        //assert
        expect(template).to.have.property('query');
        expect(template.query).to.not.be.empty;
    });
    it('should not return query',()=>{
        //assign
        const request = ''
        const template = {};
        //action
        jsonTransformer.getQuery(request, template);
        //assert
        expect(template.query).to.be.undefined;
    });
})

describe('addProfile', ()=>{
    it('should set profile to true at query object',()=>{
        //assign
        const template = {
            query: {}
        };
        //action
        jsonTransformer.addProfile(template);
        //assert
        expect(template.query.profile).to.be.true;
    });
    it('should not set profile to true at query object',()=>{
        //assign
        const template = {};
        //action
        jsonTransformer.addProfile(template);
        //assert
        expect(template).to.not.have.nested.property('query.profile');
    });
});

describe('getIndex', ()=>{
    it('should set index by url route',()=>{
        //assign
        const request = getRequestMock();
        const template = {};
        //action
        jsonTransformer.getIndex(request, template);
        //assert
        expect(request.path).to.include(template.index);
        expect(template.index).to.equal('my_index');
    });
});

describe('getCluster', ()=>{
    it('should set cluster by env',()=>{
        //assign
        const template = {};
        process.env.ES_CLUSTER_NAME = 'dev';
        //action
        jsonTransformer.getCluster(template);
        //assert
        expect(template.cluster).to.include('dev');
    });
    it('should not set cluster by env',()=>{
        //assign
        const template = {};
        delete process.env.ES_CLUSTER_NAME;
        //action
        jsonTransformer.getCluster(template);
        //assert
        expect(template).to.not.have.property('cluster');
    });
});

describe('getAgent', ()=>{
    it('should set type by hardcoded value',()=>{
        //assign
        const template = {};
        delete process.env.ES_CLUSTER_NAME;
        //action
        jsonTransformer.getAgent(template);
        //assert
        expect(template.type).to.equals('es_profiler_agent');
    });
});

describe('generateJsonToken', ()=>{
    it('should set type by hardcoded value',()=>{
        //assign
        const template = {};
        //action
        jsonTransformer.generateJsonToken(template);
        //assert
        expect(template.token).to.not.be.empty;
    });
});

describe('getProject', ()=>{
    it('should set type by hardcoded value',()=>{
        //assign
        const template = {};
        //action
        jsonTransformer.getProject(template);
        //assert
        expect(template.project).to.not.be.empty;
    });
});

describe('addQueryNamed', ()=>{
    it('should set name by all data gathered in template',()=>{
        //assign
        const template = {};
        const request = getRequestMock();
        //action
        jsonTransformer.getQuery(request, template)
                        .addProfile(template)
                        .getIndex(request, template)
                        .getCluster(template)
                        .getAgent(template)
                        .generateJsonToken(template)
                        .addQueryNamed(template);
        
        //assert
        expect(template.name).to.not.be.empty;
        expect(template.name).to.include('my_index');
    });
    it('should  not set name as cause of missing data',()=>{
        //assign
        const template = {};
        const request = getRequestMock();
        //action
        jsonTransformer.getQuery(request, template)
                        .addProfile(template)
                        .getIndex(request, template)
                        .getCluster(template)
                        .getAgent(template)
                        .generateJsonToken(template);
        template.query.query = null;
        jsonTransformer.addQueryNamed(template);
        //assert
        expect(template.name).to.not.include('my_index_test');
    });
    it('should  not set name as cause of missing data',()=>{
        //assign
        const template = {};
        const request = getRequestMockNestedName();
        //action
        jsonTransformer.getQuery(request, template)
                        .addProfile(template)
                        .getIndex(request, template)
                        .getCluster(template)
                        .getAgent(template)
                        .generateJsonToken(template)
                        .addQueryNamed(template);
        //assert
        expect(template.name).to.include('test');
    });
});

describe('addAggName', ()=>{
    it('should set name by all data gathered in template',()=>{
        //assign
        const template = {};
        const request = getRequestMockWithAgg();
        //action
        jsonTransformer.getQuery(request, template)
                        .addProfile(template)
                        .getIndex(request, template)
                        .getCluster(template)
                        .getAgent(template)
                        .generateJsonToken(template)
                        .addQueryNamed(template)
                        .addAggName(template);
        //assert
        expect(template.name).to.contain('aggregation_my_index_my_agg_');
    });

    it('should set name by all data gathered in template',()=>{
        //assign
        const template = {};
        const request = getRequestMock();
        //action
        jsonTransformer.getQuery(request, template)
                        .addProfile(template)
                        .getIndex(request, template)
                        .getCluster(template)
                        .getAgent(template)
                        .generateJsonToken(template)
                        .addQueryNamed(template)
                        .addAggName(template);
        //assert
        expect(template.name).to.contain('query_');
    });
});

describe('storeDate', ()=>{
    it('should set name by all data gathered in template',()=>{
        //assign
        const template = {};
        const request = getRequestMockWithAgg();
        //action
        jsonTransformer.getQuery(request, template)
                        .addProfile(template)
                        .getIndex(request, template)
                        .getCluster(template)
                        .getAgent(template)
                        .generateJsonToken(template)
                        .addQueryNamed(template)
                        .addAggName(template)
                        .storeDate(template);

        const current = timeUtils.getCurrentDate();
        //assert
        expect(template.storeTime).to.equal(current);
    });
});

describe('transformReqToJson', ()=>{
    it('should set name by all data gathered in template',()=>{
        //assign
        const request = getRequestMock();
        //action
        const results = jsonTransformer.transformReqToJson(request);
        //assert
        expect(results).to.be.an('object');
    });
});

function getRequestMock(){
    return {
        path:'/my_index/_search',
        body:{
            "size": 3,
            "query": {
                "function_score": {
                "_name": "test",
                "query": {},
                "random_score": {}
                }
            }
        }
    }
}

function getRequestMockNestedName(){
    return {
        path:'/my_index/_search',
        body:{
            "size": 3,
            "query": {
                "function_score": {
                "query": {
                    "bool":{
                        "filter":{
                            "_name": "test"
                        }
                    }
                },
                "random_score": {}
                }
            }
        }
    }
}

function getRequestMockWithAgg(){
    return {
        path:'/my_index/_search',
        body:{
            "size": 0,
            "aggs":{
                "my_agg":{
                    "terms":{
                        "field": "feed_section"
                    }
                }
            }
        }
    }  
}