# Detects possible SQL injection vulnerabilities originating from unsafe user input.

## Rule details
There following test files serves as a demonstration of all the different situations the rule is considering.
<br/><br/>
**The following patterns are considered warnings**:
<br/><br/>
Variable with unsafe user input is used in a template string.
```javascript
const mysql = require('mysql');
const readline = require('readline-sync');

// Create database connection with mySQL
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "password",
  database: "my_db"
});

// Some user input - SQL injection input example: 42 OR 1=1
let phone = readline.question("What is your phone number?\n");

const sql = `SELECT * FROM users where tlf = ${phone}`;

// Connect to the database
dbConnection.connect();

// Execute query
dbConnection.query(sql, (err, result) => console.log(result));
```

Variable with unsafe user input is used in a string concatenation.
```javascript
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

const sql = 'SELECT * FROM users WHERE tlf = ' + phone;

// Connect to the database
dbConnection.connect();

// Execute query
dbConnection.query(sql, (err, result) => console.log(result));
```

**The following patterns are NOT considered warnings**:
<br/><br/>
Safe query - hardcoded string.
```javascript
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
```

Variable with unsafe user input is used in a parameterized statement.
```javascript
const mysql = require('mysql');
const readline = require('readline-sync');

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'my_db',
});

// Some user input - SQL injection input example: 42 OR 1=1
let phone = readline.question("What is your phone number?\n");

const sql = 'SELECT * FROM users where tlf = ?';

// Connect to the database
dbConnection.connect();

// Execute query
dbConnection.query(sql, [phone], (err, result) => console.log(result));
```

Safe variable is used in a string concatenation.
```javascript
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
```

Safe variable is used in a template string.
```javascript
const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "password",
  database: "my_db"
});

// Variable with hard coded input
const phone = '11223344';

const sql = `SELECT * FROM users where tlf = "${phone}"`;

// Connect to the database
dbConnection.connect();

// Execute query
dbConnection.query(sql, (err, result) => console.log(result));
```

