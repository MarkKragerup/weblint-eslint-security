const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "password",
  database: "my_db"
});

// Connect to the database
dbConnection.connect();

// Execute query
dbConnection.query("SELECT * FROM users WHERE tlf = 11223344", (err, result) => console.log(result));
