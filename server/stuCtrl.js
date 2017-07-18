const APP = require('../server');
const DB = APP.get('mongo');
const URL = APP.get('url');

module.exports = {

  update: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection('students');
      delete req.body.update.id;
      collection.update({'_id': req.body.id}, req.body.update, (err, result) => {
        res.status(200).send('Updated');
      });
    });
  }

}
