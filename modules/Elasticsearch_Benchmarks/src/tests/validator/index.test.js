const expect = require('chai').expect;
const validator = require('../../validator');

describe('isSearchReq', () => {
    it('should return false', () => {
        //assign
        const params = {
            id: 'vehicles_feed_v1',
            id2: '_bulk',
            id3: undefined,
            id4: undefined
        }
        //action
        const results = validator.isSearchReq(params);
        //results
        expect(results).to.be.false;
    });
    it('should return true', () => {
        //assign
        const params = {
            id: 'vehicles_feed_v1',
            id2: '_search',
            id3: undefined,
            id4: undefined
        }
        //action
        const results = validator.isSearchReq(params);
        //results
        expect(results).to.be.true;
    });
});

describe("isTypeQueryThresholdExceed", ()=>{
    process.env.SEARCH_TYPE_SIZE = 5;
    process.chdir(`${__dirname}/../../`);
    it('should return true', ()=>{
        //assign
        const params = getPayloadMock('test');
        //action
        const results = validator.isTypeQueryThresholdExceed(params);
        //results
        expect(results).to.be.true;
    });
    it('should return false', ()=>{
        //assign
        const params = getPayloadMock('platinum');
        //action
        const results = validator.isTypeQueryThresholdExceed(params);
        //results
        expect(results).to.be.false;
    });
});

describe("isProperQueryName", ()=>{
    it('should return true', ()=>{
        //assign
        const params = getPayloadMock('test').payload.query;
        //action
        const results = validator.isProperQueryName(params);
        //results
        expect(results).to.be.true;
    });
    it('should return false', ()=>{
        //assign
        const params = getPayloadMock('test').payload.query;
        params.query.function_score = {};
        //action
        const results = validator.isProperQueryName(params);
        //results
        expect(results).to.be.false;
    });
});

describe("isProperAggName", ()=>{
    it('should return true', ()=>{
        //assign
        const params = getPayloadMock('test').payload.query;
        params.aggs ={
            my_agg:{
                terms:{
                    field:"keyword_field",
                    size:10,
                    order:{
                        _count: "desc"
                    }
                }
            }
        }
        //action
        const results = validator.isProperAggName(params);
        //results
        expect(results).to.be.true;
    });
    it('should return false', ()=>{
        //assign
        const params = getPayloadMock('test').payload.query;
        //action
        const results = validator.isProperAggName(params);
        //results
        expect(results).to.be.false;
    });
});

function getPayloadMock(name=false){
    const queryName = name || "test"
    return {
        "payload":{
            "query":{
                "profile":true,
                "size":3,
                "query":{
                    "function_score":{
                        "_name":queryName,
                    }
                }
            },
            "index":"vehicles_feed_v1",
            "cluster":"Y2-EC-DEV",
            "type":"es_profiler_agent",
            "name":`query_vehicles_feed_v1_${queryName}_xiKPTqWxzc`,
            "token":"xiKPTqWxzc",
            "project":"ES_PROFILER",
            "storeTime":"10-4-2020",
        },
        "fileName":`query_vehicles_feed_v1_${queryName}_xiKPTqWxzc`
    }
}