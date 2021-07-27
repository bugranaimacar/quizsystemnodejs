var express = require('express');
var router = express.Router();
var controller = require('../Controllers/admincontroller');
const checkJwt = require('../Middlewares/auth')

router.get('/dashboard', checkJwt.validateauthorization, checkJwt.validateadmin, controller.maindashboard);
router.get('/users', checkJwt.validateauthorization, checkJwt.validateadmin, controller.users);
router.get('/quizs', checkJwt.validateauthorization, checkJwt.validateadmin, controller.quizs);
router.get('/questions', checkJwt.validateauthorization, checkJwt.validateadmin, controller.questions);
router.get('/exams', checkJwt.validateauthorization, checkJwt.validateadmin, controller.exams);
router.get('/userreport/:examid/:userid', checkJwt.validateauthorization, checkJwt.validateadmin, controller.userreport);
router.get('/examresult/:examid', checkJwt.validateauthorization, checkJwt.validateadmin, controller.examresult);
router.get('/', checkJwt.validateauthorization, checkJwt.validateadmin, controller.maindashboard);

module.exports = router;