const validator = require("../validator")

module.exports = {
    properRequest(req, res, next){
        const searchType = this.getSearchType(req.params);
        switch(searchType){
            case "_search":{
                if(!validator.isProperStructure(JSON.parse(req.body))){
                    res.status(400).send(this.getMessage('e03'));
                    return; 
                }
                break;
            }
            case "_msearch":{
                const msearchArr = JSON.parse(
                    JSON.stringify(
                        req.body
                        .split("\n")
                        .filter(item => item.length)
                        .map(item => JSON.parse(item))
                        .filter(item => !item.index)
                    )
                );
                for (let i = 0; i < msearchArr.length; i++){
                    if(!validator.isProperStructure(msearchArr[i])){
                        res.status(400).send(this.getMessage('e03'));
                        break;
                    }
                }
                break;
            }
        }
        next();
    },
    getSearchType(params){
        const searchTypesArr = [
            '_search',
            '_msearch'
        ];
        const paramsValues = Object.values(params);
        for (let i = 0; i < searchTypesArr.length; i ++){
            if(paramsValues.indexOf(searchTypesArr[i]) > -1) return searchTypesArr[i];
        }
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