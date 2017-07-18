const SET = 'wo/SET';
const COMPLETE = 'wo/COMPLETE';
const SEARCH = 'wo/SEARCH';
const ADD = 'wo/ADD';

const initState = {
  search: '',
  workorders: []
}

export default function reducer(state=initState, action) {

  let editState = Object.assign({}, state); // create state to manipulate

  switch(action.type) {

    case SET: // initializes the work orders
      action.payload.forEach((wo) => {
        wo.id = wo._id;
        delete wo._id;
      });
      editState.workorders = action.payload;
      return Object.assign({}, state, editState);

    case COMPLETE: // toggles whether or not the work order is complete
      editState.workorders.forEach((wo, i) => {
        if (action.payload === wo.id) {
          editState.workorders[i].isComplete
            = !editState.workorders[i].isComplete;
        }
      });
      return Object.assign({}, state, editState);

    case SEARCH: // saves search text for past work order searchbar
      editState.search = action.payload;
      return Object.assign({}, state, editState);

    case ADD: // adds a new work order when student submits
      action.payload.id = editState.workorders.length+1;
      editState.workorders.push(action.payload);
      return Object.assign({}, state, editState);

    default: return state;

  }

}

/* initializes the work orders */
export function setWorkOrders(wo) {
  return {
    type: SET,
    payload: wo
  }
}

/* toggles whether or not the work order is complete */
export function complete(id) {
  return {
    type: COMPLETE,
    payload: id
  }
}

/* saves search text for past work order searchbar */
export function updateSearch(srch) {
  return {
    type: SEARCH,
    payload: srch
  }
}

/* adds a new work order when student submits */
export function addWorkOrder(wo) {
  return {
    type: ADD,
    payload: wo
  }
}
