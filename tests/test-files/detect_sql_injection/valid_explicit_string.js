var mysql = require('mysql');

var dbConnection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "password",
  database: "my_db"
});

// connect to the database
dbConnection.connect();

// execute query
dbConnection.query("SELECT * FROM users WHERE tlf = 11 22 33 44", (err, result) => console.log(result));
