const SET_ICON = 'filter/SET_ICON';
const SET_SRCH = 'filter/SET_SRCH';

const initState = {
  apartmentFilter: {
    search: false, male: false, female: false, money: false,
    beer: false, plus: false, srchTxt: ''
  },
  studentFilter: {
    search: false, male: false, female: false, money: false,
    beer: false, plus: false, srchTxt: ''
  }
}

export default function reducer(state=initState, action) {

  let editState = Object.assign({}, state); // create state to manipulate

  switch(action.type) {

    case SET_ICON: // set selected icon to it's opposite value
      if (action.payload === 'male') {
        if (editState[action.filter].female) {
          editState[action.filter].female = !editState[action.filter].female;
        }
      } else if (action.payload === 'female') {
        if (editState[action.filter].male) {
          editState[action.filter].male = !editState[action.filter].male;
        }
      }
      editState[action.filter][action.payload]
        = !editState[action.filter][action.payload];
      return Object.assign({}, state, editState);

    case SET_SRCH: // sets the search text for the filter
      editState[action.filter].srchTxt = action.payload;
      return Object.assign({}, state, editState);

    default: return state;

  }

}

/* set selected icon to it's opposite value */
export function setIcon(icon, filter) {
  return {
    type: SET_ICON,
    payload: icon,
    filter: filter
  }
}

/* sets the search text for the filter */
export function setSrch(text, filter) {
  return {
    type: SET_SRCH,
    payload: text,
    filter: filter
  }
}
