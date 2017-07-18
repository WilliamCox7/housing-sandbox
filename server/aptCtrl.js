const APP = require('../server');
const DB = APP.get('mongo');
const URL = APP.get('url');
const ObjectId = require("mongodb").ObjectId;

module.exports = {

  insert: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection(req.body.collection);
      collection.insert(req.body.insert, (err, result) => {
        res.status(200).send(result);
      });
    });
  },

  update: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection(req.body.collection);
      collection.update({'_id': ObjectId(req.body.id)}, req.body.update, (err, result) => {
        res.status(200).send('Updated');
      });
    });
  },

  remove: (req, res) => {
    DB.connect(URL, (err, db) => {
      var collection = db.collection(req.body.collection);
      collection.remove({'_id': ObjectId(req.body.id)}, (err, result) => {
        res.status(200).send('Removed');
        if (result) {
          if (req.body.collection === 'apartments') {
            var rooms = db.collection('rooms');
            rooms.find({apartment: req.body.id}, (err, cursor) => {
              cursor.each((err, room) => {
                if (room) {
                  var students = db.collection('students');
                  students.find({roomId: room._id.toString()}, (err, cursor2) => {
                    cursor2.each((err, student) => {
                      if (student) {
                        student.apartment = '';
                        student.zoneId = '';
                        student.roomId = '';
                        student.inApt = false;
                        if (student.home && student.money) {
                          student.status = 'completed';
                        } else {
                          student.status = 'pending';
                        }
                        students.update({'_id': student._id}, student);
                      }
                    });
                  });
                  rooms.remove(room);
                }
              });
            });
          } else {
            var students = db.collection('students');
            students.find({roomId: req.body.id}, (err, cursor) => {
              cursor.each((err, student) => {
                if (student) {
                  student.apartment = '';
                  student.zoneId = '';
                  student.roomId = '';
                  student.inApt = false;
                  if (student.home && student.money) {
                    student.status = 'completed';
                  } else {
                    student.status = 'pending';
                  }
                  students.update({'_id': student._id}, student);
                }
              });
            });
          }
        }
      });
    });
  }

}
