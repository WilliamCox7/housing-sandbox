const APP = require('../server');
const DB = APP.get('mongo');
const URL = APP.get('url');
const parakeet = require('../config/parakeet');
const ObjectId = require("mongodb").ObjectId;
const axios = require('axios');

function get(collection, cb) {
  var items = [];
  DB.connect(URL, (err, db) => {
    var cursor = db.collection(collection).find();
    cursor.each((err, item) => {
      if (!item) {
        cb(items);
      } else {
        items.push(item);
      }
    });
  });
}

function getApartment(aptId, cb) {
  DB.connect(URL, (err, db) => {
    var collection = db.collection('apartments');
    collection.findOne({'_id': ObjectId(aptId)}, (err, result) => {
      cb(result);
    });
  });
}

function getRoommates(aptId, cb) {
  var roommates = [];
  DB.connect(URL, (err, db) => {
    var cursor = db.collection('students').find({zoneId: aptId});
    cursor.forEach((roommate) => {
      roommates.push(roommate);
    }, (err) => {
      cb(roommates);
    });
  });
}

function getCurStudent(dmId, cb) {
  DB.connect(URL, (err, db) => {
    var collection = db.collection('students');
    collection.findOne({dmId: Number(dmId)}, (err, result) => {
      cb(result);
    });
  });
}

function getWorkOrders(dmId, cb) {
  var workorders = [];
  DB.connect(URL, (err, db) => {
    var cursor = db.collection('workorders').find({dmId: Number(dmId)});
    cursor.forEach((workorder) => {
      workorders.push(workorder);
    }, (err) => {
      cb(workorders);
    });
  });
}

function getCode(email, cb) {
  axios.post('https://portal-api.goparakeet.com/v2/login', {
    username: parakeet.username,
    password: parakeet.password
  }).then((result) => {
    axios.get('https://portal-api.goparakeet.com/v2/access?user_email='+email, {
      headers: {'Authorization': "Token " + result.data.token}
    }).then((result) => {
      cb(result.data.results[0].code);
    }).catch((err) => {
      console.log(err);
      cb('unavailable');
    });
  }).catch((err) => {
    console.log(err);
    cb('unavailable');
  });
}

module.exports = {

  getAdmin: (req, res) => {
    get('campuses', (campuses) => {
      get('apartments', (apartments) => {
        get('rooms', (rooms) => {
          get('students', (students) => {
            get('workorders', (workorders) => {
              get('faq', (faq) => {
                get('tour', (tour) => {
                  res.status(200).send({
                    campuses: campuses,
                    apartments: apartments,
                    rooms: rooms,
                    students: students,
                    workorders: workorders,
                    faq: faq,
                    tour: tour
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  getStudent: (req, res) => {
    getCurStudent(req.params.dmId, (student) => {
      if (student && student.status === 'assigned') {
        getApartment(student.zoneId, (apartment) => {
          getRoommates(student.zoneId, (roommates) => {
            getWorkOrders(req.params.dmId, (workorders) => {
              get('faq', (faq) => {
                get('tour', (tour) => {
                  getCode(student.email, (code) => {
                    student.doorCode = code;
                    res.status(200).send({
                      student: student,
                      roommates: roommates,
                      workorders: workorders,
                      faq: faq,
                      tour: tour
                    });
                  });
                });
              });
            });
          });
        });
      } else {
        res.status(200).send({
          student: student,
          roommates: [],
          workorders: [],
          faq: []
        });
      }

    });
  }

}
