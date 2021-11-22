var importValue = require('./context');
var maddi = 'hej';
for (var i = 0 ; i<10 ; i++) {
    if (i === 9) maddi = importValue;
}