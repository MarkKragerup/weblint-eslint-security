const mysql = require('mysql');
var readline = require('readline-sync');

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'my_db',
});

// some user input
// SQL injection input example: 42 OR 1=1
var phone = readline.question("What is your phone number?\n");

const sql = 'SELECT * FROM users where tlf = ?';
// connect to the database
dbConnection.connect();

// execute query
dbConnection.query(sql, [phone], (err, result) => console.log(result));
