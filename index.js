var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080);

require('dotenv').config();
var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD // in .env file, change to password accordingly or empty if needed
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
