const SET = 'user/SET';
const NAME = 'user/NAME';
const SET_ROOMMATES = 'user/SET_ROOMMATES';
const LOGOUT = 'user/LOGOUT';

const initState = {
  role: 'admin',
  isLoggedIn: true,
  name: '',
  dmId: undefined,
  roommates: []
}

export default function reducer(state=initState, action) {

  let editState = Object.assign({}, state); // create state to manipulate

  switch(action.type) {

    case SET: // initializes the user
      editState = action.payload;
      return Object.assign({}, state, editState);

    case NAME:
      editState.name = action.payload;
      return Object.assign({}, state, editState);

    case SET_ROOMMATES: // adds students roommates (if is student)
      editState.roommates = action.payload;
      return Object.assign({}, state, editState);

    case LOGOUT:
      editState = {
        role: '',
        isLoggedIn: false,
        name: '',
        dmId: undefined,
        roommates: []
      };
      return Object.assign({}, state, editState);

    default: return state;

  }

}

/* initializes the user */
export function setUser(user) {
  return {
    type: SET,
    payload: user
  }
}

export function setName(name) {
  return {
    type: NAME,
    payload: name
  }
}

/* adds students roommates (if is student) */
export function setRoommates(roommates) {
  return {
    type: SET_ROOMMATES,
    payload: roommates
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}
