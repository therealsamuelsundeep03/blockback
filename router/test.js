const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const controller = require('../controller/test');

router.get('/', controller.test);

module.exports = router;