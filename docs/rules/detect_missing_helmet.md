# Disallow use of ExpressJS applications without the use of Helmet.js defaults, due to the concern that the HTTP headers might be insecurely configured

## Rule details
The following patterns are considered warnings:
```javascript
const myOddlyNamedApp = require("express");
const myHelmetImport = require('helmet');

// Helmet is imported, but never used. The namings are weird to display implementation versatility.
myOddlyNamedApp.listen(8080);
```

```javascript
const app = require("express");
const helmet = require("helmet");

// Uses helmet expectCt, but not the default configurations
app.use(helmet.expectCt({maxAge: 3600, enforce: true}));

app.listen(8080);
```

```javascript
const app = require("express");

...

app.listen(8080);
```

The following patterns are NOT considered warnings:
```javascript
const app = require("express")
const helmet = require('helmet')

// Helmet is used, with the default configurations
app.use(helmet())

app.listen(8080)
```

```javascript
const app = require("express")
const myHelmet = require('helmet')

// Helmet is used, with the default configurations
app.use(myHelmet())

app.listen(8080)
```
