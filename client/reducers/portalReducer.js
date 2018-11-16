const NEXT = 'portal/NEXT';
const PREV = 'portal/PREV';
const DEL_FAQ = 'portal/DEL_FAQ';
const DEL_PHO = 'portal/DEL_PHO';
const ADD_FAQ = 'portal/ADD_FAQ';
const SET_FAQ = 'portal/SET_FAQ';
const STU_FAQ = 'portal/STU_FAQ';
const ADD_PHO = 'portal/ADD_PHO';
const SET_TOUR = 'portal/SET_TOUR';
const STU_TOUR = 'portal/STU_TOUR';

const initState = {
  tour: [],
  faq: []
}

export default function reducer(state=initState, action) {

  let editState = Object.assign({}, state); // create state to manipulate

  switch(action.type) {

    case NEXT: // moves url around to show next photo
      var spliced = editState.tour.splice(0, 1);
      editState.tour.push(spliced[0]);
      return Object.assign({}, state, editState);

    case PREV: // moves url around to show previous photo
      var spliced = editState.tour.splice(editState.tour.length-1, 1);
      editState.tour.unshift(spliced[0]);
      return Object.assign({}, state, editState);

    case DEL_FAQ: // deletes selected faq
      editState.faq.forEach((item, i) => {
        if (item.id === action.payload) {
          editState.faq.splice(i, 1);
        }
      });
      return Object.assign({}, state, editState);

    case DEL_PHO: // deletes selected photo
      editState.tour.forEach((item, i) => {
        if (item.id === action.payload) {
          editState.tour.splice(i, 1);
        }
      });
      return Object.assign({}, state, editState);

    case ADD_FAQ: // adds a new faq to the list
      action.payload.campus = 'Provo';
      editState.faq.push(action.payload);
      return Object.assign({}, state, editState);

    case ADD_PHO: // adds a new photo to the tour
      editState.tour.push(action.payload);
      return Object.assign({}, state, editState);

    case SET_FAQ: // initializes faq
      action.payload.forEach((faq) => {
        faq.id = faq._id; delete faq._id;
      });
      editState.faq = action.payload;
      return Object.assign({}, state, editState);

    case STU_FAQ: // initializes faq
      action.payload.forEach((faq) => {
        faq.id = faq._id; delete faq._id;
        if (faq.campus === action.campus) {
          editState.faq.push(faq);
        }
      });
      return Object.assign({}, state, editState);

    case SET_TOUR: // initializes tour
      action.payload.forEach((photo) => {
        photo.id = photo._id; delete photo._id;
        editState.tour.push(photo);
      });
      return Object.assign({}, state, editState);

    case STU_TOUR:
      action.payload.forEach((photo) => {
        photo.id = photo._id; delete photo._id;
        if (photo.campus === action.campus) {
          editState.tour.push(photo);
        }
      });
      return Object.assign({}, state, editState);

    default: return state;

  }

}

/* moves url around to show next photo */
export function next() {
  return {
    type: NEXT
  }
}

/* moves url around to show previous photo */
export function prev() {
  return {
    type: PREV
  }
}

/* deletes selected faq */
export function deleteFAQ(id) {
  return {
    type: DEL_FAQ,
    payload: id
  }
}

/* deletes selected photo */
export function deletePhoto(id) {
  return {
    type: DEL_PHO,
    payload: id
  }
}

/* adds a new faq to the list */
export function addFAQ(faq) {
  return {
    type: ADD_FAQ,
    payload: faq
  }
}

/* adds a new photo to the tour */
export function addPhoto(photo) {
  return {
    type: ADD_PHO,
    payload: photo
  }
}

/* initializes faq */
export function setFAQ(faq) {
  return {
    type: SET_FAQ,
    payload: faq
  }
}

export function stuFAQ(faq, campus) {
  return {
    type: STU_FAQ,
    payload: faq,
    campus: campus
  }
}

/* initializes tour */
export function setTour(tour) {
  return {
    type: SET_TOUR,
    payload: tour
  }
}

export function stuTour(tour, campus) {
  return {
    type: STU_TOUR,
    payload: tour,
    campus: campus
  }
}
