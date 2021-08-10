var express = require('express');
var path = require('path');
const mysql = require('mysql');
var app = express();
var mysqlbaglantisi = require('../config/sqlconfig');
var qs = require('querystring');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './pages/'))
const checkJwt = require('../Middlewares/auth');
const fs = require('fs');
var async = require('async');
var md5 = require("md5");
const moment = require("moment");


module.exports.getuseranswerinquiz = async function(req,res) {
    var tokendecoded = checkJwt.decodetoken();
    if(req.body.firstanswer && req.body.quizid)
    {
        mysqlbaglantisi.baglanti.query('SELECT id,answer FROM answers WHERE quizid = ? AND answeredby = ?', [req.body.quizid, tokendecoded.id], async function(error, results, fields) {
            if(results.length > 0){
    
                res.send(JSON.parse(JSON.stringify(results[0])));
    
            }
            else
            {
                res.send({
                    message: 'No Data Found!',
                    status: false
                });
            }
        });
        return
    }
    if(req.body.questionid){
        mysqlbaglantisi.baglanti.query('SELECT id,answer FROM answers WHERE questionid = ? AND answeredby = ?', [req.body.questionid, tokendecoded.id], async function(error, results, fields) {
        if(results.length > 0){

            res.send(JSON.parse(JSON.stringify(results)));

        }
        else
        {
            res.send({
                message: 'No Data Found!',
                status: false
            });
        }

        });
    }
    else
    {
        res.send({
            message: 'Post Data Not Found!',
            status: false
        });
    }
}

module.exports.getprevquestion = async function(req,res){
    if(req.body.quizid && req.body.questionnumber)
    {
        req.body.questionnumber--;
        mysqlbaglantisi.baglanti.query('SELECT id,image,questionnumber FROM questions WHERE quizid = ? AND questionnumber = ?', [req.body.quizid, req.body.questionnumber], async function(error, results, fields) {
            if(results.length > 0){
                res.send(JSON.parse(JSON.stringify(results)));
            }
            else
            {
                res.send({
                    message: 'No Data Found!',
                    status: false
                });
                return
            }
        });
    }
    else
    {
        res.status(403).send({
            message: 'Wrong Data!',
            status: false
        });
    }

}

    module.exports.getnextquestion = async function(req,res){
        if(req.body.quizid && req.body.questionnumber)
        {
            req.body.questionnumber++;
            mysqlbaglantisi.baglanti.query('SELECT id,image,questionnumber FROM questions WHERE quizid = ? AND questionnumber = ?', [req.body.quizid, req.body.questionnumber], async function(error, results, fields) {
                if(results.length > 0){
                    res.send(JSON.parse(JSON.stringify(results)));
                }
                else
                {
                    res.send({
                        message: 'No Data Found!',
                        status: false
                    });
                    return
                }
            });
        }
        else
        {
            res.status(403).send({
                message: 'Wrong Data!',
                status: false
            });
        }

}

    module.exports.getquestioninquiz = async function(req,res) {
        var tokendecoded = checkJwt.decodetoken();
        if(req.body.quizid)
        {
            mysqlbaglantisi.baglanti.query('SELECT id,image,questionnumber FROM questions WHERE quizid = ? AND questionnumber = 1', [req.body.quizid], async function(error, results, fields) {
                if(results.length > 0){
                    res.send(JSON.parse(JSON.stringify(results)));
                }
                else
                {
                    res.send({
                        message: 'No Data Found!',
                        status: false
                    });
                }
            });
            return
        }
        if(req.body.questionid){
            mysqlbaglantisi.baglanti.query('SELECT id,image,questionnumber FROM questions WHERE id = ?', [req.body.questionid], async function(error, results, fields) {
            if(results.length > 0){

                res.send(JSON.parse(JSON.stringify(results)));

            }
            else
            {
                res.send({
                    message: 'No Data Found!',
                    status: false
                });
            }

            });
        }
        else
        {
            res.send({
                message: 'Post Data Not Found!',
                status: false
            });
        }
    }

module.exports.getquizquestiondata = async function(req,res) {
    var tokendecoded = checkJwt.decodetoken();

    if(req.body.quizid)
    {
        mysqlbaglantisi.baglanti.query('SELECT id,quizid,image,questionnumber FROM questions WHERE quizid = ? ORDER BY questionnumber ASC', [req.body.quizid],  async function(error, results, fields) {
        var cevap = 'YOK';
            if (results.length > 0) {
                sorular = results
                mysqlbaglantisi.baglanti.query('SELECT * FROM answers WHERE quizid = ? AND answeredby = ? ORDER BY questionnumber ASC', [req.body.quizid, tokendecoded.id], async function(error, results, fields) {
                    for(var i = 0; i < sorular.length; i++) {
                        cevap = 'YOK';
                            for(var d = 0; d < results.length; d++) {
                                if(sorular[i].id == results[d].questionid) {
                                cevap = results[d].answer;
                            }
                        }
                            if(cevap == 'A')
                            {
                                res.write('<div class="row"><div id="sorusayisi"  class="col-lg-1"><label>' + sorular[i].questionnumber + '-</label><input type="hidden" name="questionid" id="questionid" value="' + sorular[i].id + '"/></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" checked type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">A</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" id="question:' + sorular[i].questionnumber + '" name="question:' + sorular[i].questionnumber + '"><label class="form-check-label">B</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">C</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">D</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">E</label></div></div><div class="col-lg-1"><i id="question:' + sorular[i].questionnumber + '" class="yansorutrash fa fa-trash"></i></div><div class="col-12"><hr style="margin-top: 5px;margin-bottom: 5px;"></div></div>')
                            }
                            else if(cevap == 'B')
                            {
                                res.write('<div class="row"><div id="sorusayisi" class="col-lg-1"><label>' + sorular[i].questionnumber + '-</label><input type="hidden" name="questionid" id="questionid" value="' + sorular[i].id + '"/></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">A</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" checked type="radio" id="question:' + sorular[i].questionnumber + '" name="question:' + sorular[i].questionnumber + '"><label class="form-check-label">B</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">C</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">D</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">E</label></div></div><div class="col-lg-1"><i id="question:' + sorular[i].questionnumber + '" class="yansorutrash fa fa-trash"></i></div><div class="col-12"><hr style="margin-top: 5px;margin-bottom: 5px;"></div></div>')
                            }
                            else if(cevap == 'C')
                            {
                                res.write('<div class="row"><div id="sorusayisi" class="col-lg-1"><label>' + sorular[i].questionnumber + '-</label><input type="hidden" name="questionid" id="questionid" value="' + sorular[i].id + '"/></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">A</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" id="question:' + sorular[i].questionnumber + '" name="question:' + sorular[i].questionnumber + '"><label class="form-check-label">B</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" checked type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">C</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">D</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">E</label></div></div><div class="col-lg-1"><i id="question:' + sorular[i].questionnumber + '" class="yansorutrash fa fa-trash"></i></div><div class="col-12"><hr style="margin-top: 5px;margin-bottom: 5px;"></div></div>')
                            }
                            else if (cevap == 'D')
                            {
                                res.write('<div class="row"><div id="sorusayisi" class="col-lg-1"><label>' + sorular[i].questionnumber + '-</label><input type="hidden" name="questionid" id="questionid" value="' + sorular[i].id + '"/></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">A</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" id="question:' + sorular[i].questionnumber + '" name="question:' + sorular[i].questionnumber + '"><label class="form-check-label">B</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">C</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" checked name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">D</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">E</label></div></div><div class="col-lg-1"><i id="question:' + sorular[i].questionnumber + '" class="yansorutrash fa fa-trash"></i></div><div class="col-12"><hr style="margin-top: 5px;margin-bottom: 5px;"></div></div>')
                            }
                            else if (cevap == 'E')
                            {
                                res.write('<div class="row"><div id="sorusayisi" class="col-lg-1"><label>' + sorular[i].questionnumber + '-</label><input type="hidden" name="questionid" id="questionid" value="' + sorular[i].id + '"/></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">A</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" id="question:' + sorular[i].questionnumber + '" name="question:' + sorular[i].questionnumber + '"><label class="form-check-label">B</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">C</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">D</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" checked name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">E</label></div></div><div class="col-lg-1"><i id="question:' + sorular[i].questionnumber + '" class="yansorutrash fa fa-trash"></i></div><div class="col-12"><hr style="margin-top: 5px;margin-bottom: 5px;"></div></div>')
                            }
                            else if (cevap == 'YOK')
                            {
                                res.write('<div class="row"><div id="sorusayisi" class="col-lg-1"><label>' + sorular[i].questionnumber + '-</label><input type="hidden" name="questionid" id="questionid" value="' + sorular[i].id + '"/></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">A</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" id="question:' + sorular[i].questionnumber + '" name="question:' + sorular[i].questionnumber + '"><label class="form-check-label">B</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">C</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">D</label></div></div><div class="col-lg-2"><div class="form-check"><input class="form-check-input" type="radio" name="question:' + sorular[i].questionnumber + '" id="question:' + sorular[i].questionnumber + '"><label class="form-check-label">E</label></div></div><div class="col-lg-1"><i id="question:' + sorular[i].questionnumber + '" class="yansorutrash fa fa-trash"></i></div><div class="col-12"><hr style="margin-top: 5px;margin-bottom: 5px;"></div></div>')
                            }
                        }
                        res.send();
                    
                });
                    }
            else
            {
                res.send({
                    message: 'No Data Found!',
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'Invalid Data!',
            status: false
        });
    }
}

module.exports.login = async function(req, res){
 if (req.body.username || req.body.password) {
    var username = req.body.username;
	var password = req.body.password;
     mysqlbaglantisi.baglanti.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], async function(error, results, fields) {
        
        if (results.length > 0) {
            if(results[0].username != username || results[0].password != password)
            {
                res.send({
                    message: 'User not found!',
                    status: false
                });
                return;
            }
                var newtoken = checkJwt.givetoken(results[0].id, results[0].username, results[0].grade, results[0].admin, results[0].section);
                         if(results[0].admin > 0)
                         {
                                    res.cookie('jwt', newtoken, { httpOnly: true, sameSite: "Strict"});
                                    res.send({
                                    message: 'Admin',
                                    token: newtoken,
                                    status: true
                                });
                                
                                console.log('An admin has logged in. (Username: ' + username + ' Password: ' + password + ')');
                                return;
                         }
                            res.cookie('jwt', newtoken, { httpOnly: true, sameSite: 'Strict'});
                            res.send({
                                message: 'User',
                                token: newtoken,
                                status: true
                                });
                                return;
         } else {
                         res.send({
                                message: 'User not found!',
                                status: false
                            });
                         return;
         }			
         
           });
    }
    else
    {
        res.send({
            message: 'Post Data Not found!',
            status: false
        });
        return;
    }
}

module.exports.saveanswer = function (req, res){
    if(req.body.questionid && req.body.answer)
    {
        var tokendecoded = checkJwt.decodetoken();
      mysqlbaglantisi.baglanti.query('SELECT quizid,questionnumber FROM questions WHERE id = ?', [req.body.questionid], async function(error, results, fields) {
         questiondata = results;
           mysqlbaglantisi.baglanti.query('SELECT examid FROM quizs WHERE id = ?', [questiondata[0].quizid], async function(error, results, fields) {
            quizdata = results;

             mysqlbaglantisi.baglanti.query('SELECT startdate,enddate,active FROM exams WHERE id = ?', [quizdata[0].examid], async function(error, results, fields) {
                if(((moment(results[0].startdate).format('yyyy-MM-DD hh:mm') > moment().format('yyyy-MM-DD hh:mm')) || (moment(results[0].enddate).format('yyyy-MM-DD hh:mm') < moment().format('yyyy-MM-DD hh:mm')) || results[0].active < 1))
                {
                    res.send({
                        message: 'Exam is not active or time is not correct!',
                        status: false
                    });
                    return;
                }


          mysqlbaglantisi.baglanti.query('SELECT COUNT(*) AS answercount FROM answers WHERE questionid = ? AND answeredby = ?', [req.body.questionid, tokendecoded.id], async function(error, results, fields) {
            if(results[0].answercount > 0)
            {
                mysqlbaglantisi.baglanti.query('UPDATE answers SET quizid = ?, questionid = ?, questionnumber = ?, answer = ? WHERE answeredby = ? AND questionid = ?', [questiondata[0].quizid, req.body.questionid, questiondata[0].questionnumber, req.body.answer, tokendecoded.id, req.body.questionid], async function(error, results, fields) {
                    if(error)
                    {
                        res.send({
                            message: error,
                            status: false
                        });
                    }
                    else
                    {
                        res.send({
                            message: 'Answer saved',
                            status: true
                        });
                    }
                });
            }
            else
            {
                mysqlbaglantisi.baglanti.query('INSERT INTO answers (quizid,questionid,questionnumber,answer,answeredby) VALUES(?,?,?,?,?)', [questiondata[0].quizid, req.body.questionid, questiondata[0].questionnumber, req.body.answer, tokendecoded.id], async function(error, results, fields) {
                    
                    if(error)
                    {
                        res.send({
                            message: error,
                            status: false
                        });
                    }
                    else
                    {
                        res.send({
                            message: 'Answer saved',
                            status: true
                        });
                    }
                });
            }
         });
        });
    });
            });
    }
    else
    {
        res.send({
            message: 'Question Data Not found!',
            status: false
        });
    }
}

module.exports.deleteanswer = function (req, res){
    if(req.body.questionid)
    {
        var tokendecoded = checkJwt.decodetoken();

        mysqlbaglantisi.baglanti.query('SELECT quizid,questionnumber FROM questions WHERE id = ?', [req.body.questionid], async function(error, results, fields) {
            questiondata = results;
            
            mysqlbaglantisi.baglanti.query('SELECT examid FROM quizs WHERE id = ?', [questiondata[0].quizid], async function(error, results, fields) {
               quizdata = results;
   
               mysqlbaglantisi.baglanti.query('SELECT startdate,enddate,active FROM exams WHERE id = ?', [quizdata[0].examid], async function(error, results, fields) {
                    if(((moment(results[0].startdate).format('yyyy-MM-DD hh:mm') > moment().format('yyyy-MM-DD hh:mm')) || (moment(results[0].enddate).format('yyyy-MM-DD hh:mm') < moment().format('yyyy-MM-DD hh:mm')) || results[0].active < 1))
                {
                       res.status(403).send({
                           message: 'Exam date is not correct or exam is not active!',
                           status: false
                       });
                       return;
                   }

        mysqlbaglantisi.baglanti.query('DELETE FROM answers WHERE answeredby = ? AND questionid = ?', [tokendecoded.id, req.body.questionid], async function(error, results, fields) {
            
            if (error) {
                res.send({
                    message: error,
                    status: false
                });
            }
            else
            {
                res.send({
                    message: 'Answer deleted!',
                    status: true
                });
            }
        });
     });
    });
});
    }
    else
    {
        res.send({
            message: 'Question Data Not found!',
            status: false
        });
    }
}

module.exports.logout = function (req, res) {
    if(req.cookies.jwt)
    {
        res.clearCookie('jwt');
    }
    res.redirect('/');
}

module.exports.deleteexamdata = function (req, res ) {
    if(req.body.examid)
    {
        mysqlbaglantisi.baglanti.query('DELETE FROM exams WHERE id = ?', [req.body.examid], async function(error, results, fields) {
            
            if (!error) {
                res.send({
                    message: req.body.examid + 'ID\'li exam başarı ile silindi!',
                    status: true
                });
            }
            else
            {
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}

module.exports.saveexamdata = function (req, res ) {
    if(req.body.newgrade == null || req.body.newstartdate == null || req.body.newenddate == null ||req.body.newsection == null || req.body.newexamname == null)
        {
            res.send({
                message: 'Some Data is missing!',
                status: false
            });
            return
        }
    if(req.body.newexamid != "")
    {
        mysqlbaglantisi.baglanti.query('UPDATE exams SET active = ?, grade = ?, section = ?, multisection = ?, multigrade = ?, examname = ?, examdetails = ?, startdate = ?, enddate = ? WHERE id = ?', [req.body.newactive, req.body.newgrade, req.body.newsection, req.body.newmultisection, req.body.newmultigrade, req.body.newexamname, req.body.newexamdetails, req.body.newstartdate, req.body.newenddate, req.body.newexamid], async function(error, results, fields) {
            
            if (!error) {
                res.send({
                    message: req.body.newexamid + ' ID\'li exam başarı ile güncellendi!',
                    status: true
                });
            }
            else{
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
    else
    {
        var startkey = md5(Math.random().toString());
        mysqlbaglantisi.baglanti.query('INSERT INTO exams(active,grade,section,multisection,multigrade,examname,examdetails,startdate,enddate,startkey) VALUES(?,?,?,?,?,?,?,?,?,?)', [req.body.newactive, req.body.newgrade, req.body.newsection, req.body.newmultisection, req.body.newmultigrade, req.body.newexamname, req.body.newexamdetails, req.body.newstartdate, req.body.newenddate, startkey], async function(error, results, fields) {
            
            if (!error) {
                res.send({
                    message: results.insertId + ' ID\'li exam başarı ile oluşturuldu!!',
                    status: true
                });
            }
            else{
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
}

module.exports.getexamdata = function (req, res ) {
    if(req.body.examid)
    {
        mysqlbaglantisi.baglanti.query('SELECT * FROM exams WHERE id = ?', [req.body.examid], async function(error, results, fields) {
            
            if (results.length > 0) {
                res.send(JSON.parse(JSON.stringify(results)));
            }
            else
            {
                res.send({
                    message: 'Exam bulunamadı!',
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}

module.exports.deletequizdata = function (req, res ) {
    if(req.body.quizid)
    {
        mysqlbaglantisi.baglanti.query('DELETE FROM quizs WHERE id = ?', [req.body.quizid], async function(error, results, fields) {
            
            if (!error) {
                let silinecekdizin = path.join('../files/images/quizid-' + req.body.quizid)
                if (fs.existsSync(silinecekdizin, {recursive: true})){
                    fs.rmdirSync(silinecekdizin, {recursive: true});
                }
                res.send({
                    message: req.body.userid + 'ID\'li quiz başarı ile silindi!',
                    status: true
                });
            }
            else
            {
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}

module.exports.savequizdata = function (req, res ) {
    if(req.body.newexamid == null || req.body.newquizname == null || req.body.newactive == null)
        {
            res.send({
                message: 'Some Data is missing!',
                status: false
            });
            return
        }
    if(req.body.newquizid != "")
    {
        mysqlbaglantisi.baglanti.query('UPDATE quizs SET examid = ?, quizname = ?, active = ? WHERE id = ?', [req.body.newexamid, req.body.newquizname, req.body.newactive, req.body.newquizid], async function(error, results, fields) {
            
            if (!error) {           
                res.send({
                    message: req.body.newquizid + ' ID\'li quiz başarı ile güncellendi!',
                    status: true
                });
            }
            else{
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
    else
    {
        mysqlbaglantisi.baglanti.query('INSERT INTO quizs(examid,quizname,active) VALUES(?,?,?)', [req.body.newexamid, req.body.newquizname, req.body.newactive], async function(error, results, fields) {
            
            if (!error) {   
                res.send({
                    message: results.insertId + ' ID\'li quiz başarı ile oluşturuldu!!',
                    status: true
                });
            }
            else{
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
}

module.exports.getquizdata = function (req, res ) {
    if(req.body.quizid)
    {
        mysqlbaglantisi.baglanti.query('SELECT * FROM quizs WHERE id = ?', [req.body.quizid], async function(error, results, fields) {
            
            if (results.length > 0) {
                res.send(JSON.parse(JSON.stringify(results)));
            }
            else
            {
                res.send({
                    message: 'Quiz bulunamadı!',
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}

module.exports.deleteuserdata = function (req, res ) {
    if(req.body.userid)
    {
        mysqlbaglantisi.baglanti.query('DELETE FROM users WHERE id = ?', [req.body.userid], async function(error, results, fields) {
            if (!error) {
                res.send({
                    message: req.body.userid + 'ID\'li kullanıcı başarı ile silindi!',
                    status: true
                });
            }
            else
            {
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}

module.exports.saveuserdata = function (req, res ) {
    if(req.body.newusername == null || req.body.newpassword == null || req.body.newgrade == null || req.body.newsection == null || req.body.newadmin == null)
        {
            res.send({
                message: 'Some Data is missing!',
                status: false
            });
            return
        }
    if(req.body.newuserid != "")
    {
        mysqlbaglantisi.baglanti.query('UPDATE users SET username = ?, password = ?, grade = ?, section = ?, admin = ? WHERE id = ?', [req.body.newusername, req.body.newpassword, req.body.newgrade, req.body.newsection, req.body.newadmin, req.body.newuserid], async function(error, results, fields) {
            if (!error) {
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: req.body.newuserid + ' ID\'li kullanıcı başarı ile güncellendi!',
                    status: true
                });
            }
            else{
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
    else
    {
        mysqlbaglantisi.baglanti.query('INSERT INTO users(username,password,grade,section,admin) VALUES(?,?,?,?,?)', [req.body.newusername, req.body.newpassword, req.body.newgrade, req.body.newsection, req.body.newadmin], async function(error, results, fields) {
            if (!error) {
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: results.insertId + ' ID\'li kullanıcı başarı ile oluşturuldu!!',
                    status: true
                });
            }
            else{
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
}

module.exports.getuserdata = function (req, res ) {
    if(req.body.userid)
    {
        mysqlbaglantisi.baglanti.query('SELECT * FROM users WHERE id = ?', [req.body.userid], async function(error, results, fields) {
            if (results.length > 0) {
                mysqlbaglantisi.baglanti.end
                res.send(JSON.parse(JSON.stringify(results)));
            }
            else
            {
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: 'Kullanıcı bulunamadı!',
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}
const formidable = require('formidable');
const { NONAME } = require('dns');
module.exports.savequestiondata = function (req, res ) {
    const form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files){
        if(fields.newquizid == null || fields.newcorrectanswer == null || fields.newquestionnumber == null)
        {
            res.send({
                message: 'Some Data is missing!',
                status: false
            });
            return
        }

        

        const questionid = fields.newquestionid
    if(questionid != "")
    {
        if(!files.newimage.type.toLowerCase().includes('image'))
        {
            res.send({
                message: 'File is not image!',
                status: false
            });
            return
        }
        else
        {
            var oldPath = files.newimage.path;
        var newPath = path.join(__dirname, '../files/images/quizid-' + fields.newquizid + '/questionid-' +  fields.newquestionid)
                + '/'+ md5(files.newimage.name) + '.png'
                var olusturulacakdizin = path.join(__dirname, '../files/images/quizid-' + fields.newquizid + '/questionid-' +  fields.newquestionid + '/')
                              
                var girilcekdizin = path.join('../files/images/quizid-' + fields.newquizid + '/questionid-' +  fields.newquestionid)
                + '/'+ md5(files.newimage.name) + '.png'

                if (!fs.existsSync(olusturulacakdizin, {recursive: true})){
                    fs.mkdirSync(olusturulacakdizin, {recursive: true});
                }
        var rawData = fs.readFileSync(oldPath)
        
        fs.writeFileSync(newPath, rawData, async function(err){
            if(err) console.log(err)
        });
        }

        mysqlbaglantisi.baglanti.query('UPDATE questions SET quizid = ?, description = ?, image = ?, correctanswer = ?, questionnumber = ? WHERE id = ?', [fields.newquizid, fields.newdescription, girilcekdizin, fields.newcorrectanswer, fields.newquestionnumber, fields.newquestionid], async function(error, results, fields) {
            if (!error) {
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: questionid + ' ID\'li Soru başarı ile güncellendi!',
                    status: true
                });
            }
            else{
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: error,
                    status: false
                });
                return
            }
        });
    }
    else
    {
        var datalar = fields;
        mysqlbaglantisi.baglanti.query('INSERT INTO questions(quizid,description,correctanswer,questionnumber) VALUES(?,?,?,?)', [fields.newquizid, fields.newdescription, fields.newcorrectanswer, fields.newquestionnumber], async function(error, results, fields) {
            if (!error) {
                mysqlbaglantisi.baglanti.end
                

                if(!files.newimage.type.toLowerCase().includes('image'))
                {
                    res.send({
                        message: 'File is not image!',
                        status: false
                    });
                    return
                }
                else
                {
                    var oldPath = files.newimage.path;
                    var newPath = path.join(__dirname, '../files/images/quizid-' + datalar.newquizid + '/questionid-' +  results.insertId)
                    + '/'+ md5(files.newimage.name) + '.png'
                    var olusturulacakdizin = path.join(__dirname, '../files/images/quizid-' + datalar.newquizid + '/questionid-' +  results.insertId + '/')
                                  
                    var girilcekdizin = path.join('../files/images/quizid-' + datalar.newquizid + '/questionid-' +  results.insertId)
                    + '/'+ md5(files.newimage.name) + '.png' 
        
                        if (!fs.existsSync(olusturulacakdizin, {recursive: true})){
                            fs.mkdirSync(olusturulacakdizin, {recursive: true});
                        }
                var rawData = fs.readFileSync(oldPath)
                
                fs.writeFileSync(newPath, rawData, async function(err){
                    if(err) console.log(err)
                });
                }




                mysqlbaglantisi.baglanti.query('UPDATE questions SET quizid = ?, description = ?, image = ?, correctanswer = ?, questionnumber = ? WHERE id = ?', [datalar.newquizid, datalar.newdescription, girilcekdizin, datalar.newcorrectanswer, datalar.newquestionnumber, results.insertId], async function(error, results, fields) {
                    if (!error) {
                        mysqlbaglantisi.baglanti.end
                        res.send({
                            message: results.insertId + ' ID\'li Soru başarı ile oluşturuldu ve güncellendi!',
                            status: true
                        });
                    }
                    else
                    {
                        res.send({
                            message: error,
                            status: true
                        });
                        return
                    }
                });
                
                

            }
            else{
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: error,
                    status: false
                });
                return
            }
            

        });
    }
});
}

module.exports.getuserdata = function (req, res ) {
    if(req.body.userid)
    {
        mysqlbaglantisi.baglanti.query('SELECT * FROM users WHERE id = ?', [req.body.userid], async function(error, results, fields) {
            if (results.length > 0) {
                mysqlbaglantisi.baglanti.end
                res.send(JSON.parse(JSON.stringify(results)));
            }
            else
            {
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: 'Kullanıcı bulunamadı!',
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}

module.exports.deletequestiondata = function (req, res ) {
    if(req.body.newquestionid || req.body.newquizid)
    {
        let silinecekdizin = path.join(__dirname, '../files/images/quizid-' + req.body.newquizid + '/questionid-' +  req.body.newquestionid)
                if (fs.existsSync(silinecekdizin, {recursive: true})){
                    fs.rmdirSync(silinecekdizin, {recursive: true});
                }
        mysqlbaglantisi.baglanti.query('DELETE FROM questions WHERE id = ?', [req.body.newquestionid], async function(error, results, fields) {
            if (!error) {
                res.send({
                    message: req.body.newquestionid + ' ID\'li Soru başarı ile silindi!',
                    status: true
                });
            }
            else
            {
                res.send({
                    message: error,
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}

module.exports.getquestiondata = function (req, res ) {
    if(req.body.questionid)
    {
        mysqlbaglantisi.baglanti.query('SELECT * FROM questions WHERE id = ?', [req.body.questionid], async function(error, results, fields) {
            if (results.length > 0) {
                mysqlbaglantisi.baglanti.end
                res.send(JSON.parse(JSON.stringify(results)));
            }
            else
            {
                mysqlbaglantisi.baglanti.end
                res.send({
                    message: 'Soru bulunamadı!',
                    status: false
                });
            }
        });
    }
    else
    {
        res.send({
            message: 'No Data',
            status: false
        });
        return
    }
}