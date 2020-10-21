const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const services = require('../services');
const middlewares = require('../middleware');

router.use(bodyParser.text({type: '*/*'}))

router.get('/:id/:id2?/:id3?/:id4?',
    [middlewares.properRequest.bind(middlewares)],
    services.collectRequestQuery.bind(services)
);

module.exports = router;