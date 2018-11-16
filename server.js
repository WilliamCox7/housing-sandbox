/* PACKAGES */
const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');
const APP = module.exports = EXPRESS();

/* APP */
APP.set('port', (process.env.PORT || 3001));
APP.use(BODY_PARSER.json({limit: '50mb'}));
APP.use(EXPRESS.static(__dirname + '/build'));

APP.listen(APP.get('port'), () => {
  console.log('localhost:' + APP.get('port'));
});
