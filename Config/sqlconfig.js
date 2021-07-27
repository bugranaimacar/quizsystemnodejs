const mysql = require('mysql');

let connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'quizsistemi',
   charset : 'utf8'
});

connection.connect(function(err){
      if(err) throw err;
});

module.exports.baglanti = connection;