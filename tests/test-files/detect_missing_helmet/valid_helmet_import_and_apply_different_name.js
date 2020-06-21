const app = require("express")
const myHelmet = require('helmet')

// Helmet is used, with the default configurations
app.use(myHelmet())

app.listen(8080)
