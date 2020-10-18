const controller = require('./controller');

const express = require('express');

const router = express.Router();

router.get('/', controller.getRatings);
router.get('/comment', controller.getComment);
router.post('/comment', controller.updateComment)
router.get('/countries', controller.getCountries);

module.exports = router;
