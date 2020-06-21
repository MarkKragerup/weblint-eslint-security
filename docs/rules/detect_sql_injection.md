# Detects possible SQL injection vulnerabilities originating from unsafe user input.

## Rule details
The following patterns are considered warnings:
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

The following patterns are NOT considered warnings:
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

