const APP = require('../server');
const DB = APP.get('mongo');
const URL = APP.get('url');
const ObjectId = require("mongodb").ObjectId;
var emailjs = require('emailjs');

module.exports = {

  update: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection('workorders');
      delete req.body.update.id;
      collection.update({'_id': ObjectId(req.body.id)}, req.body.update, (err, result) => {
        res.status(200).send('Updated');
      });
    });
  },

  insert: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection('workorders');
      collection.insert(req.body, (err, result) => {
        res.status(200).send(result);
      });
    });
    emailjs.server.connect({
      user: 'cahlan@devmounta.in',
      password: 'e9S7ZCYsdIf4VhB1viHkqw',
      host: 'smtp.mandrillapp.com',
      port: 587
    }).send({
      to: req.body.manager,
      from: 'noreply@devmountain.com',
      subject: 'New Work Order',
      text: req.body.name + ' created a work order for ' + req.body.subject + '.\n\n' + req.body.body
    }, (err, message) => {
      console.log(err, message);
    });
  }

}
