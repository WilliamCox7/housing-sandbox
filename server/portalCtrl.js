const APP = require('../server');
const DB = APP.get('mongo');
const URL = APP.get('url');
const ObjectId = require("mongodb").ObjectId;
const CONFIG = require("../config/config");
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: CONFIG.aws.accessKeyId,
  secretAccessKey: CONFIG.aws.secretAccessKey,
  region: "us-east-1"
});

const s3 = new AWS.S3();

function uploadToS3(image, cb) {
  const buf = new Buffer(image.imageBody.replace(
    /^data:image\/\w+;base64,/, ""), 'base64'
  );
  s3.upload({
    Bucket: 'devmountain/housing',
    Key: image.imageName,
    Body: buf,
    ContentType: 'image/' + image.imageExtension,
    ACL: 'public-read'
  }, (err, data) => {
    cb(err, data);
  })
}

function deleteFromS3(url, cb) {
  url = decodeURI(url.slice(url.indexOf('.com/devmountain')+19));
  s3.deleteObject({
    Bucket: 'devmountain',
    Key: url
  }, (err, data) => {
    if (err) console.error(err);

    cb(err, data);
  });
}

module.exports = {

  insert: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection(req.body.collection);
      collection.insert(req.body.insert, (err, result) => {
        res.status(200).send(result);
      });
    });
  },

  remove: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection(req.body.collection);
      collection.remove({'_id': ObjectId(req.body.id)}, (err, result) => {
        res.status(200).send('Removed');
      });
    });
  },

  insertS3: (req, res) => {
    uploadToS3(req.body.insert, (err, data) => {
      DB.connect(URL, (err, db) => {
        var collection = db.collection('tour');
        collection.insert({
          url: data.Location,
          campus: req.body.campus
        }, (err, result) => {
          if (err) { res.status(500).send(err); }
          res.status(200).send(result);
        });
      });
    });
  },

  removeS3: (req, res) => {
    deleteFromS3(req.body.url, (err, data) => {
      DB.connect(URL, (err, db) => {
        var collection = db.collection('tour');
        collection.remove({'_id': ObjectId(req.body.id)}, (err, result) => {
          res.status(200).send('Removed');
        });
      });
    });
  }

}
