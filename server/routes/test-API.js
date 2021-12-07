var express = require("express");
var router = express.Router();

var clicks = 0;

router.get("/", function(req, res, next) {
    clicks++;
    data = clicks.toString();
    res.send(data);
});

module.exports = router;