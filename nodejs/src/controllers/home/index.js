const controller = require('./controller');

var express = require('express');


var router = express.Router();

router.get('/', controller.home);


module.exports = router;
