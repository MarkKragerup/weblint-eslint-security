const mysql = require('mysql');
const readline = require('readline-sync');

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "password",
  database: "my_db"
});

// Some user input - SQL injection input example: 42 OR 1=1
let phone = readline.question("What is your phone number?\n");

const sql = 'SELECT * FROM users WHERE tlf = ?';

// Connect to the database
dbConnection.connect();

// Execute query
dbConnection.query(sql, [phone], (err, result) => console.log(result));
