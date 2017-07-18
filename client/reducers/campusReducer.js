const SET = 'campus/SET';
const SET_CITY = 'campus/SET_CITY';

const initState = {
  city: 'Provo',
  sts: ["UT"],
  campuses: { UT: { campuses: ["Provo"]}}
}

export default function reducer(state=initState, action) {

  let editState = Object.assign({}, state); // create state to manipulate

  switch(action.type) {

    case SET: // initializes campuses and the states they are in
      action.payload.forEach((campus) => {
        if (!editState.campuses[campus.state]) {
          editState.campuses[campus.state] = {
            campuses: [campus.city]
          }
          editState.sts.push(campus.state);
        } else {
          editState.campuses[campus.state].campuses.push(campus.city);
        }
      });
      return Object.assign({}, state, editState);

    case SET_CITY: // sets the current selected campus for later use
      editState.city = action.payload;
      return Object.assign({}, state, editState);

    default: return state;

  }

}

/* initializes campuses and the states they are in */
export function setCampuses(campuses) {
  return {
    type: SET,
    payload: campuses
  }
}

/* sets the current selected campus for later use */
export function setCity(city) {
  return {
    type: SET_CITY,
    payload: city
  }
}
