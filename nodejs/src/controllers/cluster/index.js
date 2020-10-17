const controller = require('./controller');

const express = require('express');

const router = express.Router();

router.get('/', controller.getCategories);
router.get('/subcategories', controller.getSubcategories);

module.exports = router;
