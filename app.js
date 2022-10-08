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
});

app.get('/wallet', function (req, res) {
    connection.query('SELECT * FROM wallet', function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(result[0]);
        }
    })
});

// app.get('/wallet/:address', function (req, res) {
//     connection.query('SELECT * FROM wallet', function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.status(200).json(result[0]);
//         }
//     })
// });

app.listen(8080, function () {
    console.log('Node app is being served on port: 8080')
})

module.exports = app;