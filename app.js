var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
const checkJwt = require('./Middlewares/auth')

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/files', express.static(path.join(__dirname, 'files')))
app.set('view engine', 'ejs');
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');


app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(express.json({limit: '50mb'}));

app.use(cookieParser());


var controllerlogin = require('./Controllers/logincontroller');
var routeapi = require('./Routes/apiroute');
var routeexam = require('./Routes/examroute');
var routeadmin = require('./Routes/adminroute');

const { name } = require('ejs');
app.use('/api', routeapi);
app.use('/exam', routeexam);
app.use('/admin', routeadmin);
app.get('/', checkJwt.checklogin, controllerlogin.login);
app.listen(8090);