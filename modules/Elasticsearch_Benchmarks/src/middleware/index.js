const validator = require("../validator")

module.exports = {
    properRequest(req, res, next){
        if(!validator.isSearchReq(req.params)){
            res.send(this.getMessage('e01')).status(400);
            return;
        }
        if(!validator.isProperStructure(req.body)){
            res.send(this.getMessage('e03')).status(400);
            return; 
        }
        next();
    },
    getMessage(errKey){
        const messages = {
            success: "Query saved\n",
            e01: 'This is not search request\n',
            e02: `This type of query appears ${process.env.SEARCH_TYPE_SIZE} times. Query didn't saved to filesystem. \n`,
            e03: `The query doesn't include query name or aggregation section.`
        }
        return messages[errKey];
    }
}