# Detects possible SQL injection vulnerabilities originating from unsafe user input.

## Rule details
There following test files serves as a demonstration of all the different situations the rule is considering.
<br/><br/>
**The following patterns are considered warnings**:
<br/><br/>
Variable with unsafe user input is used in a template string.
```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

// some user input
const address = prompt('What is your address?');

const sql = `SELECT * FROM customers WHERE address = ${address}`;

con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
```

Variable with unsafe user input is used in a string concatenation.
```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

// some user input
const address = prompt('What is your address?');

const sql = 'SELECT * FROM customers WHERE address = ' + address;

con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
```

**The following patterns are NOT considered warnings**:
<br/><br/>
Safe query - hardcoded string.
```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM customers WHERE address = 'Park Lane 38'", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
```

Safe variable is used in string concatenation.
```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

const address = 'Park View 12';
const sql = 'SELECT * FROM customers WHERE address = ' + address;

con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
```

Safe variable is used in template string.
```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

const address = 'Park View 12';
const sql = `SELECT * FROM customers WHERE address = ${address}`;

con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
```

