# Disallow use of ExpressJS applications without the use of Helmet.js defaults, due to the concern that the HTTP headers might be insecurely configured

## Rule details
There following test files serves as a demonstration of all the different situations the rule is considering.
<br/><br/>
**The following patterns are considered warnings**:
<br/><br/>
Helmet is imported but never used.
```javascript
const myOddlyNamedApp = require("express");
const myHelmetImport = require('helmet');

// Helmet is imported, but never used. The namings are weird to display implementation versatility.
myOddlyNamedApp.listen(8080);
```

Helmet uses expectCT, but not the default configurations.
```javascript
const app = require("express");
const helmet = require("helmet");

// Uses helmet expectCt, but not the default configurations
app.use(helmet.expectCt({maxAge: 3600, enforce: true}));

app.listen(8080);
```

Helmet is not used.
```javascript
const app = require("express");

...

app.listen(8080);
```

The following patterns are NOT considered warnings:
Helmet is imported and used correctly, with the use of the default configurations.
```javascript
const app = require("express")
const helmet = require('helmet')

// Helmet is used, with the default configurations
app.use(helmet())

app.listen(8080)
```

Helmet is imported and used correctly, with the use of the default configurations. This test shows the user can call the variables whatever they would like.
```javascript
const app = require("express")
const myHelmet = require('helmet')

// Helmet is used, with the default configurations
app.use(myHelmet())

app.listen(8080)
```
