var express = require('express');
var router = express.Router();
var controller = require('../Controllers/examcontroller');
const checkJwt = require('../Middlewares/auth')

router.get('/mainexam', checkJwt.validateauthorization, controller.mainexam);

router.get('/startexam/:startkey', checkJwt.validateauthorization, controller.startexam);

module.exports = router;