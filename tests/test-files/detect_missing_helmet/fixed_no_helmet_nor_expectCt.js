const app = require('express');
const helmet = require('helmet');
app.use(helmet());
app.listen(8080);
