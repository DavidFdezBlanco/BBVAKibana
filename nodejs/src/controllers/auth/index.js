const controller = require('./controller');

var express = require('express');


var router = express.Router();

router.post('/login', controller.login);


module.exports = router;
