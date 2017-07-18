const SET = 'apartment/SET';
const EDIT_APT = 'apartment/EDIT_APT';
const EDIT_STU = 'apartment/EDIT_STU';
const MOVE_STU = 'apartment/MOVE_STU';
const REM = 'apartment/REM';
const ADD_APT = 'apartment/ADD_APT';
const ADD_ROOM = 'apartment/ADD_ROOM';
const EDIT_ROOM = 'apartment/EDIT_ROOM';
const REM_ROOM = 'apartment/REM_ROOM';
const REM_FRM_APT = 'apartment/REM_FRM_APT';
const APP_STU = 'apartment/APP_STU';
const TOG_GEN = 'apartment/TOG_GEN';

const initState = {
  nextRoomId: 0,
  maleRemaining: {},
  femaleRemaining: {},
  apartments: [],
  students: [],
  waitlist: []
}

export default function reducer(state=initState, action) {

  let editState = Object.assign({}, state); // create state to manipulate

  switch(action.type) {

    case SET: // initializes apartments, rooms, students, and waitlist

      /* add apartments and rooms for those apartments */
      action.apartments.forEach((apartment) => {
        apartment.id = apartment._id;
        delete apartment._id;
        apartment.rooms = [];
        action.rooms.forEach((room) => {
          if (apartment.id === room.apartment) {
            room.id = room._id;
            delete room._id;
            room.residents = [];
            room.nextCohort = [];
            apartment.rooms.push(room);

            /* maintain count of available spaces for males/females*/
            if (apartment.gender) {
              if (!editState.maleRemaining[apartment.campus]) {
                editState.maleRemaining[apartment.campus]
                  = Number(room.capacity);
              } else {
                editState.maleRemaining[apartment.campus]
                  += Number(room.capacity);
              }
            } else {
              if (!editState.femaleRemaining[apartment.campus]) {
                editState.femaleRemaining[apartment.campus]
                  = Number(room.capacity);
              } else {
                editState.femaleRemaining[apartment.campus]
                  += Number(room.capacity);
              }
            }

          }
        });
        editState.apartments.push(apartment);
      });

      /* now add students to either waiting list, pending list, or apartment */
      action.students.forEach((student) => {
        student.id = student._id;
        delete student._id;
        if (student.inApt) {
          editState.apartments.forEach((apartment) => {
            apartment.rooms.forEach((room) => {
              if (student.roomId === room.id) {
                room[student.moveFrom].push(student);
                if (student.moveFrom === "nextCohort") {
                  if (student.male) {
                    editState.maleRemaining[apartment.campus]--;
                  } else {
                    editState.femaleRemaining[apartment.campus]--;
                  }
                }
              }
            });
          });
        } else {
          if (student.status === "waiting") {
            var isNew = true;
            editState.waitlist.forEach((list, i) => {
              if (list.name === student.cohort) {
                editState.waitlist[i].students.push(student);
                isNew = false;
              }
            });
            if (isNew) {
              editState.waitlist.push({
                name: student.cohort,
                campus: student.campus,
                starts: student.starts,
                graduates: student.graduates,
                students: [student]
              });
            }
          } else if (student.status === "pending" ||
            student.status === "completed") {
              editState.students.push(student);
          }
        }
      });
      return Object.assign({}, state, editState);

    case EDIT_APT: // save over apartment with new info (payload)
      editState.apartments.forEach((apartment, i) => {
        if (apartment.id === action.payload.id) {
          editState.apartments[i] = action.payload;
        }
      });
      return Object.assign({}, state, editState);

    case REM: // remove apartment, rooms, and students from apartment list
      var removedApt;
      editState.apartments.forEach((apartment, i) => {
        if (apartment.id === action.payload) {
          removedApt = editState.apartments.splice(i, 1);
          removedApt["0"].rooms.forEach((room) => {
            /* maintain spaces available for males/females */
            if (apartment.gender) {
              editState.maleRemaining[apartment.campus]
                -= Number(room.capacity);
            } else {
              editState.femaleRemaining[apartment.campus]
                -= Number(room.capacity);
            }
            /* move student to pending list */
            room.residents.forEach((resident, j) => {
              resident.apartment = '';
              resident.zoneId = '';
              resident.roomId = '';
              resident.inApt = false;
              editState.students.push(resident);
            });
          });
        }
      });
      return Object.assign({}, state, editState);

    case EDIT_STU: // saves over selected student (payload)
      /* if student is in an apartment */
      // have to find where student is in reducer before updating
      if (action.payload.zoneId) {
        editState.apartments.forEach((apartment, i) => {
          if (action.payload.zoneId === apartment.id) {
            apartment.rooms.forEach((room, j) => {
              if (action.payload.roomId === room.id) {
                room[action.payload.moveFrom].forEach((resident, k) => {
                  if (action.payload.id === resident.id) {
                    editState.apartments[i].rooms[j][action.payload.moveFrom][k]
                      = action.payload;
                  }
                });
              }
            });
          }
        });
      } else {
        /* if not in apartments, is it in waitlist or pending list? */
        if (action.comp === 'Apartments') {
          editState.students.forEach((student, i) => {
            if (student.id === action.payload.id) {
              editState.students[i] = action.payload;
            }
          });
        } else { // if in waiting list
          editState.waitlist.forEach((list, i) => {
            list.students.forEach((student, j) => {
              if (student.id === action.payload.id) {
                editState.waitlist[i].students[j] = action.payload;
              }
            });
          });
        }

      }
      return Object.assign({}, state, editState);

    case MOVE_STU: // moves student from current location to dropzone location
      /* find student location and then move */
      if (action.stu.inApt) {
        editState.apartments.forEach((apartment, i) => {
          if (action.stu.zoneId === apartment.id) {
            apartment.rooms.forEach((room, j) => {
              if (action.stu.roomId === room.id) {
                room[action.stu.moveFrom].forEach((resident, k) => {
                  if (resident.id === action.stu.id) {
                    var test = editState.apartments[i].rooms[j]
                      [action.stu.moveFrom].splice(k, 1);
                    if (action.stu.moveFrom === 'nextCohort') {
                      if (apartment.gender) {
                        editState.maleRemaining[apartment.campus]++;
                      } else {
                        editState.femaleRemaining[apartment.campus]++;
                      }
                    }
                  }
                });
              }
            });
          }
        });
      } else {
        editState.students.forEach((student, i) => {
          if (action.stu.id === student.id) {
            editState.students.splice(i, 1);
          }
        });
      }
      editState.apartments.forEach((apartment, i) => {
        if (apartment.id === action.zoneId) {
          apartment.rooms.forEach((room, j) => {
            if (room.id === action.roomId) {
              action.stu.apartment = apartment.street + ', ' + apartment.no;
              action.stu.zoneId = apartment.id;
              action.stu.roomId = room.id;
              action.stu.inApt = true;
              action.stu.moveFrom = action.array;
              editState.apartments[i].rooms[j][action.array].push(action.stu);
              if (action.array === 'nextCohort') {
                if (apartment.gender) {
                  editState.maleRemaining[apartment.campus]--;
                } else {
                  editState.femaleRemaining[apartment.campus]--;
                }
              }
            }
          });
        }
      });
      return Object.assign({}, state, editState);

    case ADD_APT: // adds a new blank apartment
      action.payload.id = action.payload._id;
      delete action.payload._id;
      action.payload.rooms = [];
      editState.apartments.push(action.payload);
      return Object.assign({}, state, editState);

    case ADD_ROOM: // adds a new blank room
      editState.apartments.forEach((apartment, i) => {
        if (apartment.id === action.payload.apartment) {
          action.payload.id = action.payload._id;
          delete action.payload._id;
          action.payload.residents = [];
          action.payload.nextCohort = [];
          editState.apartments[i].rooms.push(action.payload);
          /* maintain spaces available for males/females */
          if (apartment.gender) {
            if (!editState.maleRemaining[apartment.campus]) {
              editState.maleRemaining[apartment.campus] = 1;
            } else {
              editState.maleRemaining[apartment.campus]++;
            }
          } else {
            if (!editState.femaleRemaining[apartment.campus]) {
              editState.femaleRemaining[apartment.campus] = 1;
            } else {
              editState.femaleRemaining[apartment.campus]++;
            }
          }
        }
      });
      editState.nextRoomId++;
      return Object.assign({}, state, editState);

    case EDIT_ROOM: // saves over a room (with payload)
      editState.apartments.forEach((apartment, i) => {
        if (apartment.id === action.zoneId) {
          apartment.rooms.forEach((room, j) => {
            if (room.id === action.roomId) {
              var curCap = editState.apartments[i].rooms[j].capacity;
              var newCap = action.payload.capacity;
              if (apartment.gender) {
                editState.maleRemaining[apartment.campus] += newCap - curCap;
              } else {
                editState.femaleRemaining[apartment.campus] += newCap - curCap;
              }
              editState.apartments[i].rooms[j] = action.payload;
            }
          });
        }
      });
      return Object.assign({}, state, editState);

    case REM_ROOM: // removes room and students in that room
      editState.apartments.forEach((apartment, i) => {
        if (apartment.id === action.zoneId) {
          apartment.rooms.forEach((room, j) => {
            if (room.id === action.roomId) {
              var removedRoom = editState.apartments[i].rooms.splice(j, 1);
              /* maintain spaces available for males/females */
              if (apartment.gender) {
                editState.maleRemaining[apartment.campus]
                  -= Number(removedRoom["0"].capacity)
                  - removedRoom["0"].nextCohort.length;
              } else {
                editState.femaleRemaining[apartment.campus]
                  -= Number(removedRoom["0"].capacity)
                  - removedRoom["0"].nextCohort.length;
              }
              removedRoom["0"].residents.forEach((resident) => {
                resident.apartment = '';
                resident.zoneId = '';
                resident.roomId = '';
                resident.inApt = false;
                editState.students.push(resident);
              });
              removedRoom["0"].nextCohort.forEach((futResident) => {
                futResident.apartment = '';
                futResident.zoneId = '';
                futResident.roomId = '';
                futResident.inApt = false;
                editState.students.push(futResident);
              });
            }
          });
        }
      });
      return Object.assign({}, state, editState);

    case REM_FRM_APT: // removes a single student from an apartment/room
      editState.apartments.forEach((apartment, i) => {
        apartment.rooms.forEach((room, j) => {
          room[action.array].forEach((resident, k) => {
            if (resident.id === action.payload) {
              var removedResident = editState.apartments[i].rooms[j]
                [action.array].splice(k, 1);
              removedResident["0"].apartment = '';
              removedResident["0"].zoneId = '';
              removedResident["0"].roomId = '';
              removedResident["0"].inApt = false;
              editState.students.push(removedResident["0"]);
              if (action.array === 'nextCohort') {
                if (apartment.gender) {
                  editState.maleRemaining[apartment.campus]++;
                } else {
                  editState.femaleRemaining[apartment.campus]++;
                }
              }
            }
          });
        });
      });
      return Object.assign({}, state, editState);

    case APP_STU: // moves student from waiting list to pending list
      editState.waitlist.forEach((list, i) => {
        list.students.forEach((student, j) => {
          if (student.id === action.payload) {
            var approveStudent = editState.waitlist[i].students.splice(j, 1);
            editState.students.push(approveStudent["0"]);
          }
        });
      });
      return Object.assign({}, state, editState);

    case TOG_GEN: // changes an apartment from one gender to the other
      editState.apartments.forEach((apartment, i) => {
        if (apartment.id === action.payload) {
          var count = 0;
          apartment.rooms.forEach((room) => {
            count += room.capacity - room.nextCohort.length;
          });
          /* maintain spaces available for males/females */
          if (editState.apartments[i].gender) {
            if (!editState.femaleRemaining[apartment.campus]) {
              editState.maleRemaining[apartment.campus] -= count;
              editState.femaleRemaining[apartment.campus] = count;
            } else {
              editState.maleRemaining[apartment.campus] -= count;
              editState.femaleRemaining[apartment.campus] += count;
            }
          } else {
            if (!editState.maleRemaining[apartment.campus]) {
              editState.femaleRemaining[apartment.campus] -= count;
              editState.maleRemaining[apartment.campus] = count;
            } else {
              editState.femaleRemaining[apartment.campus] -= count;
              editState.maleRemaining[apartment.campus] += count;
            }
          }
          editState.apartments[i].gender = !editState.apartments[i].gender
        }
      });
      return Object.assign({}, state, editState);

    default: return state;

  }

}

/* initializes apartments, rooms, students, and waitlist */
export function setApartments(data) {
  return {
    type: SET,
    apartments: data.apartments,
    rooms: data.rooms,
    students: data.students
  }
}

/* save over apartment with new info (payload) */
export function editApt(apt) {
  return {
    type: EDIT_APT,
    payload: apt
  }
}

/* remove apartment, rooms, and students from apartment list */
export function removeApt(id) {
  return {
    type: REM,
    payload: id
  }
}

/* saves over selected student (payload) */
export function editStudent(stu, comp) {
  return {
    type: EDIT_STU,
    payload: stu,
    comp: comp
  }
}

/* moves student from current location to dropzone location */
export function moveStudent(stu, zoneId, roomId, array) {
  return {
    type: MOVE_STU,
    stu: stu,
    zoneId: zoneId,
    roomId: roomId,
    array: array
  }
}

/* adds a new blank apartment */
export function addApartment(newApt) {
  return {
    type: ADD_APT,
    payload: newApt
  }
}

/* adds a new blank room */
export function addRoom(newRoom) {
  return {
    type: ADD_ROOM,
    payload: newRoom
  }
}

/* saves over a room (with payload) */
export function editRoom(zoneId, roomId, room) {
  return {
    type: EDIT_ROOM,
    zoneId: zoneId,
    roomId: roomId,
    payload: room
  }
}

/* removes room and students in that room */
export function removeRoom(zoneId, roomId) {
  return {
    type: REM_ROOM,
    zoneId: zoneId,
    roomId: roomId
  }
}

/* removes a single student from an apartment/room */
export function removeFromApt(id, array) {
  return {
    type: REM_FRM_APT,
    payload: id,
    array: array
  }
}

/* moves student from waiting list to pending list */
export function approveStudent(id) {
  return {
    type: APP_STU,
    payload: id
  }
}

/* changes an apartment from one gender to the other */
export function toggleGender(id) {
  return {
    type: TOG_GEN,
    payload: id
  }
}
