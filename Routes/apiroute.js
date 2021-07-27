var express = require('express');
var router = express.Router();
var controller = require('../Controllers/apicontroller');
const checkJwt = require('../Middlewares/auth')
router.post('/do-login', controller.login);
router.get('/do-logout', controller.logout);
router.post('/getquizquestiondata', checkJwt.validateauthorization, controller.getquizquestiondata);
router.put('/saveanswer', checkJwt.validateauthorization, controller.saveanswer);
router.delete('/deleteanswer', checkJwt.validateauthorization, controller.deleteanswer);
router.post('/getuseranswerinquiz', checkJwt.validateauthorization, controller.getuseranswerinquiz);
router.post('/getquestioninquiz', checkJwt.validateauthorization, controller.getquestioninquiz);
router.post('/getnextquestion', checkJwt.validateauthorization, controller.getnextquestion);
router.post('/getprevquestion', checkJwt.validateauthorization, controller.getprevquestion);
router.post('/admin/getuserdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.getuserdata)
router.post('/admin/saveuserdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.saveuserdata)
router.post('/admin/deleteuserdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.deleteuserdata)
router.post('/admin/getquestiondata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.getquestiondata)
router.post('/admin/savequestiondata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.savequestiondata)
router.post('/admin/deletequestiondata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.deletequestiondata)
router.post('/admin/getquizdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.getquizdata)
router.post('/admin/savequizdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.savequizdata)
router.post('/admin/deletequizdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.deletequizdata)
router.post('/admin/getexamdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.getexamdata)
router.post('/admin/saveexamdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.saveexamdata)
router.post('/admin/deleteexamdata', checkJwt.validateauthorization, checkJwt.validateadmin, controller.deleteexamdata)
module.exports = router;