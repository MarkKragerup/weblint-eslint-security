const app = require('express');
const helmet = require('helmet');

// Uses helmet expectCt, but not the default configurations
app.use(helmet.expectCt({maxAge: 3600, enforce: true}));

app.use(helmet());
app.listen(8080);
