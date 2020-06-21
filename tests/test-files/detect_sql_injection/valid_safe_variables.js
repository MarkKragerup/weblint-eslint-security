const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "password",
  database: "my_db"
});

// Variable with hard coded input
const phone = 11223344;

const sql = 'SELECT * FROM users WHERE tlf = ' + phone;

// Connect to the database
dbConnection.connect();

// Execute query
dbConnection.query(sql, (err, result) => console.log(result));
