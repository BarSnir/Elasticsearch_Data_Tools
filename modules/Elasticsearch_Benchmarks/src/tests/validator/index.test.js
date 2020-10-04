const expect = require('chai').expect;
const validator = require('../../validator');


describe('isSearchReq', () => {
    it('should return false', () => {
        //assign
        const params = {
            id: 'vehicles_feed_v1',
            id2: '_search',
            id3: undefined,
            id4: undefined
        },
        body = {
            "test":"purpose"
        }
        //action
        const results = validator.isSearchReq(params, body);
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
        },
        body = {
            "query":{
                "term":{
                    "field": "value"
                }
            }
        }
        //action
        const results = validator.isSearchReq(params, body);
        //results
        expect(results).to.be.true;
    });
});


describe('gotProperQueryStructure', () => {
    it('should return false', () => {
        //assign
        body = {
            "test":"purpose"
        }
        //action
        const results = validator.gotProperQueryStructure(body);
        //results
        expect(results).to.be.false;
    });
    it('should return false', () => {
        //assign
        body = {
            "query":{}
        }
        //action
        const results = validator.gotProperQueryStructure(body);
        //results
        expect(results).to.be.false;
    });
    it('should return true', () => {
        //assign
        body = {
            "query":{
                "term":{
                    "field": "value"
                }
            }
        }
        //action
        const results = validator.gotProperQueryStructure(body);
        //results
        expect(results).to.be.true;
    });
    it('should return false', () => {
        //assign
        body = {
            "aggs":{}
        }
        //action
        const results = validator.gotProperQueryStructure(body);
        //results
        expect(results).to.be.false;
    });
    it('should return true', () => {
        //assign
        body = {
            "aggs":{
                "some_agg":{
                    "terms":{
                        "field": "some_field"
                    }
                }
            }
        }
        //action
        const results = validator.gotProperQueryStructure(body);
        //results
        expect(results).to.be.true;
    });
});

describe("isTypeQueryThresholdExceed", ()=>{
    it('should return false', ()=>{
                //assign
                const params = getPayloadMock();
                //action
                const results = validator.isTypeQueryThresholdExceed(params);
                //results
                expect(results).to.be.true;
    });
});



function getPayloadMock(){
    return {
        "payload":{
            "query":{
                "profile":true,
                "size":3,
                "query":{
                    "function_score":{
                        "_name":"test_a",
                    }
                }
            },
            "index":"vehicles_feed_v1",
            "cluster":"Y2-EC-DEV",
            "type":"es_profiler_agent",
            "name":"query_vehicles_feed_v1_test_xiKPTqWxzc",
            "token":"xiKPTqWxzc",
            "project":"ES_PROFILER",
            "storeTime":"10-4-2020",
        },
        "fileName":"query_vehicles_feed_v1_test_xiKPTqWxzc"
    }
}