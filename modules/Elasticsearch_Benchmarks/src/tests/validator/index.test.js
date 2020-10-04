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