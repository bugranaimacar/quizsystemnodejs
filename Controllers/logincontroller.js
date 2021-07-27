var express = require('express');
var path = require('path');
var app = express();


app.set('view engine', 'ejs');

module.exports.login = function(req, res){
        res.render(path.join(__dirname, '../pages/login'));
}
