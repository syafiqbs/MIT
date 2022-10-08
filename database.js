require('dotenv').config();
var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD // in .env file, change to password accordingly or empty if needed
});

module.exports = con;