const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const services = require('../services');

router.use(bodyParser.json())

router.get(
    '/:id/:id2?/:id3?/:id4?',
     services.collectRequestQuery.bind(services)
);

module.exports = router;