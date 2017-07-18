/* PACKAGES */
const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');
const CORS = require('cors');
const SESSION = require('express-session');
const PASSPORT = require('passport');
const CONFIG = require('./config/config');
const MONGO_CLIENT = require('mongodb').MongoClient;
const MONGO_URI = CONFIG.mongo || 'mongodb://localhost:27017/dvmtnhousing';
const DEVMTN = require('devmtn-auth');
const DEVMTNAUTHCONFIG = CONFIG.auth;
const DEVMTNSTRATEGY = DEVMTN.Strategy;
const APP = module.exports = EXPRESS();

/* APP */
APP.set('port', (CONFIG.port || 8003));
APP.set('mongo', MONGO_CLIENT);
APP.set('url', (process.env.MONGODB_URI || MONGO_URI));
APP.use(BODY_PARSER.json({limit: '50mb'}));
APP.use(CORS());
APP.use(PASSPORT.initialize());
APP.use(PASSPORT.session());
APP.use(EXPRESS.static(__dirname + '/build'));
APP.use(SESSION({
  secret: CONFIG.session.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 24}
}));

PASSPORT.serializeUser((user, done) => { done(null, user); });
PASSPORT.deserializeUser((obj, done) => { done(null, obj); });

APP.get('/auth/devmtn', PASSPORT.authenticate('devmtn'));
PASSPORT.use('devmtn', new DEVMTNSTRATEGY(DEVMTNAUTHCONFIG,
  (jwtoken, user, done) => {
    done(null, user);
}));
APP.get('/auth/devmtn/callback', PASSPORT.authenticate(
  'devmtn', {failureRedirect: '/#/', successRedirect: '/#/'}
), (req, res) => {
    res.status(200).send(req.user);
});

APP.get('/auth/me', (req, res)=>{
  if (req.session&&req.session.passport&&req.session.passport.user){
    return res.send(req.session.passport.user);
  }
  res.sendStatus(403)
});

APP.get('/logout', (req, res) => {
  if (req.session.passport) {
    req.session.passport.user = undefined;
  }
  res.redirect('/');
});

const sfCtrl = require('./server/sfCtrl');
const mainCtrl = require('./server/mainCtrl');
const aptCtrl = require('./server/aptCtrl');
const stuCtrl = require('./server/stuCtrl');
const woCtrl = require('./server/woCtrl');
const portalCtrl = require('./server/portalCtrl');
/* ENDPOINTS */
APP.get('/getSF', (req, res) => {
  sfCtrl.getCampuses(req, res);
  sfCtrl.getStudents(req, res);
});

APP.get('/admin/getAdmin', mainCtrl.getAdmin);
APP.get('/student/getStudent/:dmId', mainCtrl.getStudent);
APP.post('/apartments/insert', aptCtrl.insert);
APP.post('/apartments/update', aptCtrl.update);
APP.post('/apartments/remove', aptCtrl.remove);
APP.post('/students/update', (req, res) => {
  stuCtrl.update(req, res);
  // sfCtrl.update(req, res);
});
APP.post('/workorders/update', woCtrl.update);
APP.post('/workorders/insert', woCtrl.insert);
APP.post('/portal/insert', portalCtrl.insert);
APP.post('/portal/remove', portalCtrl.remove);
APP.post('/portal/insertS3', portalCtrl.insertS3);
APP.post('/portal/removeS3', portalCtrl.removeS3);

APP.listen(APP.get('port'), () => {
  console.log('localhost:' + APP.get('port'));
});
