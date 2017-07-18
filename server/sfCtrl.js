const APP = require('../server');
const DB = APP.get('mongo');
const URL = APP.get('url');
const SF = require('../config/salesforce');
const JSFORCE = require('jsforce');
const AXIOS = require('axios');
const READLINE = require('readline');

var sfUser, sfPassword, conn;
if (SF.sfProduction) {
  conn = new JSFORCE.Connection();
  sfUser = SF.live.sfUser;
  sfPassword = SF.live.sfPassword + SF.live.sfToken;
} else {
  conn = new JSFORCE.Connection({loginUrl: 'https://test.salesforce.com'});
  sfUser = SF.sandbox.sfUser;
  sfPassword = SF.sandbox.sfPassword + SF.sandbox.sfToken;
}

function login() {
  return conn.login(sfUser, sfPassword).then((response) => {
    return response;
  }).catch((err) => {
    console.error("Error Logging into SF");
  });
}

function isMale(gender) {
  if (gender === 'm' || gender === 'Male') { return true; }
}

function getAge(birthday) {
  var ageDifMs = Date.now() - new Date(birthday).getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function overAge(birthday) {
  var age = getAge(birthday);
  return age >= 21;
}

function findDistance(campusLat, campusLng, response) {
  if (response.data.results[0]) {
    var location = response.data.results[0].geometry.location;
    var d = getDistance(campusLat, campusLng, location.lat, location.lng);
    if (d >= 50) { return 'pending'; }
    else { return 'waiting'; }
  } else {
    return 'waiting';
  }
}

function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * .62137119;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

var updCnt = 0, newCnt = 0;
function insertIntoDB(newStudents, status, iter) {
  var student = newStudents[iter];
  DB.connect(URL, (err, db) => {
    var collection = db.collection('students');
    if (student.update) {
      collection.update({
        _id: student._id
      }, {
        inApt: student.inApt,
        name: student.name,
        cohort: student.cohort,
        male: isMale(student.gender) ? true : false,
        female: isMale(student.gender) ? false : true,
        age: student.age,
        money: student.money,
        beer: student.beer,
        home: student.home,
        birthday: student.birthday,
        email: student.email,
        phone: student.phone,
        starts: student.starts,
        graduates: student.graduates,
        make: student.make,
        model: student.make,
        color: student.color,
        plate: student.plate,
        apartment: student.apartment,
        notes: student.notes,
        zoneId: student.zoneId,
        roomId: student.roomId,
        moveFrom: student.moveFrom,
        doorCode: student.doorCode,
        campus: student.campus,
        status: student.status,
        manager: student.manager,
        dmId: student.dmId,
        contact: student.contact
      }, (err) => {
        if (err) { console.log(err); }
        else {
          iter++; updCnt++;
          if (iter < newStudents.length) {
            mapRequest(iter, newStudents);
          } else {
            if (newCnt) {
              console.log('added ' + newCnt + ' new student(s)');
            }
            if (updCnt) {
              console.log('updated ' + updCnt + ' student(s)');
            }
          }
        }
      });
    } else {
      collection.insert({
        _id: student.Id,
        inApt: false,
        name: student.Name,
        cohort: student.Cohort__r.Name,
        male: isMale(student.Student__r.hed__Gender__c) ? true : false,
        female: isMale(student.Student__r.hed__Gender__c) ? false : true,
        age: getAge(student.Student__r.Birthdate),
        money: student.Paid_Housing_Deposit__c,
        beer: overAge(student.Student__r.Birthdate),
        home: student.Housing_Contract_Signed__c,
        birthday: student.Student__r.Birthdate,
        email: student.Student__r.Email,
        phone: student.Student__r.Phone,
        starts: student.Cohort_Date_Start__c,
        graduates: student.Cohort_Date_End__c,
        make: '', model: '', color: '', plate: '',
        apartment: '', notes: '', zoneId: '', roomId: '',
        moveFrom: '', doorCode: '',
        campus: student.Cohort_Campus__c,
        status: status,
        manager: student.Housing_Manager__c,
        dmId: student.Student__r.dmId__c,
        contact: student.Student__c
      }, (err) => {
        if (err) { console.log(err); }
        else {
          iter++; newCnt++;
          if (iter === 0) { process.stdout.write("0.0% complete"); }
          if (iter < newStudents.length) {
            let per = Math.round((iter/newStudents.length)*100, -1);
            READLINE.clearLine(process.stdout, 0);
            READLINE.cursorTo(process.stdout, 0, null);
            process.stdout.write(per + "% complete");
            mapRequest(iter, newStudents);
          } else {
            if (newCnt) {
              READLINE.clearLine(process.stdout, 0);
              console.log('added ' + newCnt + ' new student(s)');
            }
            if (updCnt) {
              READLINE.clearLine(process.stdout, 0);
              console.log('updated ' + updCnt + ' student(s)');
            }
          }
        }
      });
    }
  });
}

var coordinates = {};

function mapRequest(iter, newStudents) {
  if (!newStudents[iter].update) {
    var address = newStudents[iter].Student__r.MailingAddress;
    if (address) {
      if (address.country === 'US') {
        var stuzip = address.postalCode;
        var stupath = 'http://maps.google.com/maps/api/geocode/json?address=';
        stupath += stuzip + '&sensor=false';
        AXIOS.get(stupath).then((response) => {
          if (!coordinates[newStudents[iter].Cohort_Campus__c]) {
            var campuszip = newStudents[iter].Cohort__r.Campus__r.Zip__c;
            var campuspath = 'http://maps.google.com/maps/api/geocode/json?address=';
            campuspath += campuszip + '&sensor=false';
            AXIOS.get(campuspath).then((response) => {
              var location = response.data.results[0].geometry.location;
              var status = findDistance(location.lat, location.lng, response);
              coordinates[newStudents[iter].Cohort_Campus__c] = {
                lat: location.lat, lng: location.lng
              }
              insertIntoDB(newStudents, status, iter);
            }).catch((err) => {
              console.log(err);
            });
          } else {
            var campusLat = coordinates[newStudents[iter].Cohort_Campus__c].lat;
            var campusLng = coordinates[newStudents[iter].Cohort_Campus__c].lng;
            var status = findDistance(campusLat, campusLng, response);
            insertIntoDB(newStudents, status, iter);
          }
        }).catch((err) => {
          console.log(err);
        });
      } else {
        insertIntoDB(newStudents, 'pending', iter);
      }
    } else {
      insertIntoDB(newStudents, 'waiting', iter);
    }
  } else {
    insertIntoDB(newStudents, null, iter);
  }
}

module.exports = {

  getCampuses: (req, res) => {
    return login().then(() => {
      return conn.sobject('Campus__c').select(
        'City__c, State__c'
      ).then((campuses) => {
        DB.connect(URL, (err, db) => {
          var collection = db.collection('campuses');
          campuses.forEach((campus) => {
            collection.update({
              city: campus.City__c
            }, {
              city: campus.City__c,
              state: campus.State__c
            }, {
              upsert: true
            }, (err) => {
              if (err) { console.log(err); }
            });
          });
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  },

  getStudents: (req, res) => {
    return login().then(() => {
      return conn.sobject('Enrollment__c').select(
        `Id, Name, Cohort__r.Name, Student__r.hed__Gender__c, Housing_Contract_Signed__c,
         Student__r.Birthdate, Paid_Housing_Deposit__c, Housing_Manager__c,
         Student__r.Email, Student__r.Phone, Cohort_Date_Start__c,
         Cohort_Date_End__c, Cohort_Campus__c, Student__r.MailingAddress,
         Cohort__r.Campus__r.Zip__c, Student__r.dmId__c, Student__c`
      ).then((students) => {

        var foundNewStudents = new Promise((resolve, reject) => {
          var newStudents = [];
          var findCount = 0;
          DB.connect(URL, (err, db) => {
          var collection = db.collection('students');
            students.forEach((student) => {
              collection.findOne({_id: student.Id}, (err, result) => {
                if (!result) {
                  findCount++;
                  if (new Date(student.Cohort_Date_End__c) > new Date()) {
                    student.update = false;
                    newStudents.push(student);
                  }
                } else {
                  findCount++;
                  if (result.name !== student.Name ||
                  result.cohort !== student.Cohort__r.Name ||
                  result.male !== isMale(student.Student__r.hed__Gender__c) ||
                  result.birthday !== student.Student__r.Birthdate ||
                  result.money !== student.Paid_Housing_Deposit__c ||
                  result.email !== student.Student__r.Email ||
                  result.phone !== student.Student__r.Phone ||
                  result.starts !== student.Cohort_Date_Start__c ||
                  result.graduates !== student.Cohort_Date_End__c ||
                  result.campus !== student.Cohort_Campus__c ||
                  result.dmId !== student.Student__r.dmId__c ||
                  result.contact !== student.Student__c ||
                  result.manager !== student.Housing_Manager__c ||
                  result.home !== student.Housing_Contract_Signed__c) {
                    result.update = true;
                    result.name = student.Name;
                    result.cohort = student.Cohort__r.Name;
                    result.gender = student.Student__r.hed__Gender__c;
                    result.birthday = student.Student__r.Birthdate;
                    result.money = student.Paid_Housing_Deposit__c;
                    result.email = student.Student__r.Email;
                    result.phone = student.Student__r.Phone;
                    result.starts = student.Cohort_Date_Start__c;
                    result.graduates = student.Cohort_Date_End__c;
                    result.campus = student.Cohort_Campus__c;
                    result.dmId = student.Student__r.dmId__c;
                    result.contact = student.Student__c;
                    result.manager = student.Housing_Manager__c;
                    result.home = student.Housing_Contract_Signed__c;
                    newStudents.push(result);
                  }
                }
                if (findCount === students.length && newStudents.length > 0) { resolve(newStudents); }
                else if (findCount === students.length && newStudents.length === 0) { reject(); }
              });
            });
          });
        });

        foundNewStudents.then((newStudents) => {
          // newStudents = newStudents.splice(0, 10); //for testing
          console.log('beginning upsert for ' + newStudents.length + ' students');
          updCnt = 0; newCnt = 0;
          mapRequest(0, newStudents);
        }).catch((err) => {
          console.log('No new students to add... ', err);
        });

      }).catch((err) => {
        console.log(err);
      });
    });
  },

  update: (req, res) => {
    return login().then(() => {
      return conn.sobject("Contact").update({
        Id: req.body.update.contact,
        FirstName: req.body.update.name.split(" ")[0],
        LastName: req.body.update.name.split(" ")[1],
        hed__Gender__c: req.body.update.male ? 'm' : 'f',
        Birthdate: req.body.update.birthday,
        Email: req.body.update.email,
        Phone: req.body.update.phone
      }, (err, ret) => {
        if (err) { console.log(err); }
      });
    });
  }

}
