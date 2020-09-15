const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json())

router.get('/:id/:id2?/:id3?/:id4?', function (req, res) {
    console.log(req.params);
    console.log(req.body);
    res.send("query received");
});

module.exports = router;