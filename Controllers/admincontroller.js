var express = require('express');
var path = require('path');
var app = express();
const mysql = require('mysql');

var mysqlbaglantisi = require('../config/sqlconfig');

app.set('view engine', 'ejs');

module.exports.maindashboard = function(req, res){
                res.render(path.join(__dirname, '../pages/admindashboard'));

}

module.exports.users = function(req, res){
        mysqlbaglantisi.baglanti.query('SELECT * FROM users ORDER BY ID', async function(error, results, fields) {
                
                        const userresults = JSON.parse(JSON.stringify(results));
                        res.render(path.join(__dirname, '../pages/users'), {
                                users: userresults
                        });
                });
}

module.exports.quizs = function(req,res){
        mysqlbaglantisi.baglanti.query('SELECT * FROM quizs ORDER BY ID', async function(error, results, fields){
                
                const quizresults = JSON.parse(JSON.stringify(results));
                res.render(path.join(__dirname, '../pages/quizs'),{
                        quizs: quizresults
                });
        });
}

module.exports.examresult = async function(req,res){
        var quizs;
        var useranswers = [];
        var answers;
        var questions;
        var userquestions = [];
        var verdigicevaplar = [];
        var puanlar = [];

        await new Promise((resolve, reject) => {
                mysqlbaglantisi.baglanti.query('SELECT * FROM quizs WHERE examid = ?', [req.params.examid], async function(error, results, fields){
                        if(results.length > 0)
                        {
                                quizs = JSON.parse(JSON.stringify(results));
                        resolve();
                        }
                        else
                        {
                                res.send({
                                        message: 'No Data Found!',
                                        status: false
                                    });
                                    return;
                                    resolve();
                        }
                });

        });


                for(var i = 0; i < quizs.length; i++)
                {
                        

                       await new Promise((resolve, reject) => {
                        mysqlbaglantisi.baglanti.query('SELECT * FROM answers WHERE quizid = ? ORDER BY questionnumber ASC', [quizs[i].id], async function(error, results, fields){      
                                if(results.length > 0){
                                answers = JSON.parse(JSON.stringify(results));
                                for(var d = 0; d < answers.length; d++)
                                {
                                        useranswers.push(answers[d]);
                                }
                             }
                             resolve();
                          });
                        });

                        await new Promise((resolve, reject) => {
                                mysqlbaglantisi.baglanti.query('SELECT * FROM questions WHERE quizid = ? ORDER BY questionnumber ASC', [quizs[i].id], async function(error, results, fields){      
                                        questions = JSON.parse(JSON.stringify(results));
                                        for(var a = 0; a < questions.length; a++)
                                        {
                                                userquestions.push(questions[a]);
                                        }
                                        resolve();
                                  });
                                });

                }

                for(var i = 0; i < useranswers.length; i++)
                {
                        for(var d = 0; d < userquestions.length; d++)
                        {
                                if(useranswers[i].questionid == userquestions[d].id)
                                {
                                        if(useranswers[i].answer == userquestions[d].correctanswer)
                                        {
                                                verdigicevaplar.push({
                                                        userid: useranswers[i].answeredby,
                                                        questionid: userquestions[d].id,
                                                        status: 'correct'
                                                })
                                        }
                                        else
                                        {
                                                verdigicevaplar.push({
                                                        userid: useranswers[i].answeredby,
                                                        questionid: userquestions[d].id,
                                                        status: 'wrong'
                                                })
                                        }
                                }
                        }
                }

                function contains(arr, key, val) {
                        for (var i = 0; i < arr.length; i++) {
                            if(arr[i][key] === val) return true;
                        }
                        return false;
                    }

                    function getvalueandgivepoint(arr, key, val) {
                        for (var i = 0; i < arr.length; i++) {
                            if(arr[i][key] === val) 
                            {
                                arr[i].point = (arr[i].point + 4);
                                arr[i].net = (arr[i].net + 1);
                                arr[i].dogrucevap = (arr[i].dogrucevap + 1);
                            } 
                        }
                        return false;
                    }

                    function getvalueandtakepoint(arr, key, val) {
                        for (var i = 0; i < arr.length; i++) {
                            if(arr[i][key] === val) 
                            {
                                arr[i].point = (arr[i].point - 2);
                                arr[i].yanliscevap = (arr[i].yanliscevap + 1);
                                arr[i].net = (arr[i].net - 0.25);
                            } 
                        }
                        return false;
                    }


                var dogru = verdigicevaplar.filter(x => x.status === "correct");
                for(var f = 0; f < dogru.length; f++)
                {
                        if(!contains(puanlar, "userid", dogru[f].userid))
                        {
                                puanlar.push({
                                        userid: dogru[f].userid,
                                        net: 1,
                                        dogrucevap: 1,
                                        point: 4
                                })
                        }
                        else
                        {
                                getvalueandgivepoint(puanlar, "userid", dogru[f].userid);
                        }
                }

                var yanlis = verdigicevaplar.filter(x => x.status === "wrong");
                for(var f = 0; f < yanlis.length; f++)
                {
                        if(!contains(puanlar, "userid", yanlis[f].userid))
                        {
                                puanlar.push({
                                        userid: yanlis[f].userid,
                                        yanliscevap: 1,
                                        net: -0.25,
                                        point: -2
                                })
                        }
                        else
                        {
                                getvalueandtakepoint(puanlar, "userid", yanlis[f].userid);
                        }
                }


                puanlar.sort(function(a,b){ 
                        var x = a.net > b.net? -1:1; 
                        return x; 
                    });

                    var usernames = [];

                    for(var a = 0; a < puanlar.length; a++)
                        {
                                await new Promise((resolve, reject) => {
                                        mysqlbaglantisi.baglanti.query('SELECT username FROM users WHERE id = ?', [puanlar[a].userid], async function(error, results, fields){      
                                                for(var c = 0; c < results.length; c++)
                                                {
                                                        usernames.push(results[c].username);
                                                }
                                                resolve();
                                        });
                                 });
                        }

                    res.render(path.join(__dirname, '../pages/examresult'),{
                        puanlar: puanlar,
                        isimler: usernames,
                        examid: req.params.examid
                });
}

module.exports.userreport = async function(req,res){
        var quizs;
        var useranswers = [];
        var answers;
        var examname;
        var userdetails;
        var userquestions = [];
        var questions;

        await new Promise((resolve, reject) => {
                mysqlbaglantisi.baglanti.query('SELECT id,username,grade,section FROM users WHERE id = ?', [req.params.userid], async function(error, results, fields){
                        if(results.length > 0){
                        userdetails = JSON.parse(JSON.stringify(results[0]));
                        resolve();
                        }
                        else
                        {
                                res.send({
                                        message: 'No Data Found!',
                                        status: false
                                    });  
                                    return;
                                    resolve();
                        }
                });

        });


        await new Promise((resolve, reject) => {
                mysqlbaglantisi.baglanti.query('SELECT examdetails FROM exams WHERE id = ?', [req.params.examid], async function(error, results, fields){
                        if(results.length > 0){
                        examname = JSON.parse(JSON.stringify(results[0].examdetails));
                        resolve();
                        }
                        else
                        {
                                res.send({
                                        message: 'No Data Found!',
                                        status: false
                                    });
                                    return;
                                    resolve();
                        }
                });

        });

        
                await new Promise((resolve, reject) => {
                mysqlbaglantisi.baglanti.query('SELECT * FROM quizs WHERE examid = ?', [req.params.examid], async function(error, results, fields){
                        if(results.length > 0)
                        {
                                quizs = JSON.parse(JSON.stringify(results));
                        resolve();
                        }
                        else
                        {
                                res.send({
                                        message: 'No Data Found!',
                                        status: false
                                    });
                                    return;
                                    resolve();
                        }
                });

        });


                for(var i = 0; i < quizs.length; i++)
                {
                        

                       await new Promise((resolve, reject) => {
                        mysqlbaglantisi.baglanti.query('SELECT * FROM answers WHERE quizid = ? AND answeredby = ? ORDER BY questionnumber ASC', [quizs[i].id, req.params.userid], async function(error, results, fields){      
                                if(results.length > 0){
                                answers = JSON.parse(JSON.stringify(results));
                                for(var d = 0; d < answers.length; d++)
                                {
                                        useranswers.push(answers[d]);
                                }
                             }
                             resolve();
                          });
                        });

                        await new Promise((resolve, reject) => {
                                mysqlbaglantisi.baglanti.query('SELECT * FROM questions WHERE quizid = ? ORDER BY questionnumber ASC', [quizs[i].id], async function(error, results, fields){      
                                        questions = JSON.parse(JSON.stringify(results));
                                        for(var a = 0; a < questions.length; a++)
                                        {
                                                userquestions.push(questions[a]);
                                        }
                                        resolve();
                                  });
                                });

                }

                res.render(path.join(__dirname, '../pages/userreport'),{
                        useranswers: useranswers,
                        quizs: quizs,
                        examname: examname,
                        userdetails: userdetails,
                        userquestions: userquestions
                });
}

module.exports.exams = function(req,res){
        mysqlbaglantisi.baglanti.query('SELECT * FROM exams ORDER BY ID', async function(error, results, fields){
                
                const examresults = JSON.parse(JSON.stringify(results));
                res.render(path.join(__dirname, '../pages/exams'),{
                        exams: examresults
                });
        });
}

module.exports.questions = function(req, res){
        mysqlbaglantisi.baglanti.query('SELECT * FROM questions ORDER BY ID', async function(error, results, fields) {
                
                        const questionresults = JSON.parse(JSON.stringify(results));
                        res.render(path.join(__dirname, '../pages/questions'), {
                                questions: questionresults
                        });
                });
}
