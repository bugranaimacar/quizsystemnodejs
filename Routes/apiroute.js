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
router.post('/admin/getuserdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.getuserdata)
router.post('/admin/saveuserdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.saveuserdata)
router.post('/admin/deleteuserdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.deleteuserdata)
router.post('/admin/getquestiondata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.getquestiondata)
router.post('/admin/savequestiondata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.savequestiondata)
router.post('/admin/deletequestiondata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.deletequestiondata)
router.post('/admin/getquizdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.getquizdata)
router.post('/admin/savequizdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.savequizdata)
router.post('/admin/deletequizdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.deletequizdata)
router.post('/admin/getexamdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.getexamdata)
router.post('/admin/saveexamdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.saveexamdata)
router.post('/admin/deleteexamdata', checkJwt.validateapiauthorization, checkJwt.validateadmin, controller.deleteexamdata)
module.exports = router;
