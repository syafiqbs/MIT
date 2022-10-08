var http = require('http');
var express = require('express');
var connection = require('./database.js');
var cors = require('cors');

var app = express();

app.use(cors());

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(8080);

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/wallet', function (req, res) {
    console.log("test")
    connection.query('SELECT * FROM wallet', function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res)

            // if exists // check for any new transaction
            


            // if does not exist, return the latest transaction
        }
    })
})

app.listen(8080, function () {
    console.log('Node app is being served on port: 8080')
})

module.exports = app;