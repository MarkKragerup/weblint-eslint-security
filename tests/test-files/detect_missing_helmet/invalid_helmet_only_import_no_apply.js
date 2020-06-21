const myOddlyNamedApp = require("express");
const myHelmetImport = require('helmet');

// Helmet is imported, but never used. The namings are weird to display implementation versatility.
myOddlyNamedApp.listen(8080);