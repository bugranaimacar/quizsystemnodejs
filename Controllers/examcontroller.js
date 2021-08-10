var express = require('express');
var path = require('path');
const mysql = require('mysql');
var mysqlbaglantisi = require('../config/sqlconfig');
var app = express();
app.set('view engine', 'ejs');
const checkJwt = require('../Middlewares/auth')

const moment = require("moment");

module.exports.mainexam = function(req, res){
    const tokendecoded = checkJwt.decodetoken()
    mysqlbaglantisi.baglanti.query('SELECT * FROM exams WHERE active = 1', [tokendecoded.grade, tokendecoded.section], async function(error, results, fields) {
        if(results.length > 0)
    {
        const exams = JSON.parse(JSON.stringify(results));
        res.render(path.join(__dirname, '../pages/mainexam-2'), {
            examlist: exams,
            moment: moment,
            decodedtoken: tokendecoded
        });
    }
    else
    {
        res.render(path.join(__dirname, '../pages/mainexam'), {
            decodedtoken: tokendecoded
        });
    }
    });
}

module.exports.startexam = function (req, res) {
    var tokendecoded = checkJwt.decodetoken();
    mysqlbaglantisi.baglanti.query('SELECT * FROM exams WHERE active = 1 AND startkey = ?', [req.params.startkey], async function(error,results,fields) {
        if(results.length > 0)
        {
            if(((results[0].grade != tokendecoded.grade) && (results[0].multigrade != 1)) || (((results[0].section != tokendecoded.section)) && (results[0].multisection != 1)))
            {
                res.status(403).send({
                    message: 'not authorized!',
                    status: false
                });
                return;
            }
            if(((moment(results[0].startdate).format('yyyy-MM-DD hh:mm') > moment().format('yyyy-MM-DD hh:mm')) || (moment(results[0].enddate).format('yyyy-MM-DD hh:mm') < moment().format('yyyy-MM-DD hh:mm')) || results[0].active < 1))
            {
                res.status(403).send({
                    message: 'Exam date is not correct or exam is not active!',
                    status: false
                });
                return;
            }
            
            var sonuclar = results;
            mysqlbaglantisi.baglanti.query('SELECT * FROM quizs WHERE examid = ? AND active = 1 ORDER BY id', [sonuclar[0].id], async function(error,results,fields) {
                if(results.length > 0)
                {
                    
                    var quizler = results;
                    mysqlbaglantisi.baglanti.query('SELECT * FROM questions WHERE quizid = ? ORDER BY questionnumber ASC', [quizler[0].id], async function(error,results,fields) {
                        
                        if(results.length > 0)
                        {
                            var questions = results
                    mysqlbaglantisi.baglanti.query('SELECT * FROM answers WHERE quizid = ? AND answeredby = ? ORDER BY questionnumber ASC', [quizler[0].id, tokendecoded.id], async function(error,results,fields) {
                        if(results.length > 0)
                        {
                            res.render(path.join(__dirname, '../pages/doexam'), {
                                exam: sonuclar,
                                quiz: quizler,
                                answer: results,
                                ilksorucevap: 'YOK',
                                cevap: 'YOK',
                                question: questions,
                                decodedtoken: tokendecoded
                        });   
                        }
                        else
                        {
                            res.render(path.join(__dirname, '../pages/doexam'), {
                                exam: sonuclar,
                                question: questions,
                                answer: 'YOK',
                                cevap: 'YOK',
                                quiz: quizler,
                                decodedtoken: tokendecoded
                        });   
                        }
                    });
                    }
                    else
                    {
                        res.send({
                            message: 'No Question Found!',
                            status: false
                        });
                    }
                });
                    
                }
                else
                {
                    res.send({
                        message: 'Quiz Not Found!',
                        status: false
                    });
                }
            });
                
            
        }
        else
        {
            res.send({
                message: 'Exam Not Found or not active!',
                status: false
            });
        }
    });

}