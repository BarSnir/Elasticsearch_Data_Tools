const chai = require('chai');
const expect = chai.expect;
const reportTransformer = require('../../transformers/reportTransformer');
const timeUtils = require('../../../library/utils/time');


describe('transformers properties check', ()=>{
    it('log.a is a string',()=>{
        //assign
        const logsMessage = reportTransformer.logMessages.a;
        //assert
        expect(logsMessage).to.be.a('string');
    });
    it('log.a is a string',()=>{
        //assign
        const logsMessage = reportTransformer.logMessages.a;
        //assert
        expect(logsMessage).to.be.a('string');
    });
})

