const app = require("express")
const helmet = require('helmet')

// Helmet is used, with the default configurations
app.use(helmet())

app.listen(8080)
