const SET = 'student/SET';
const EDIT = 'student/EDIT';

const initState = {
  id: undefined, inApt: false, name: '', cohort: '', male: false,
  female: true, age: undefined, money: false, beer: false, home: false,
  birthday: undefined, email: '', phone: '', starts: undefined,
  graduates: undefined, make: '', model: '', color: '', plate: '',
  apartment: '', notes: '', zoneId: '', roomId: '', moveFrom: '',
  status: 'assigned', campus: '', doorCode: '', dmId: undefined,
  contact: ''
}

export default function reducer(state=initState, action) {

  let editState = Object.assign({}, state); // create state to manipulate

  switch(action.type) {

    case SET: // initializes the selected student/user
      editState = action.payload;
      return Object.assign({}, state, editState);

    case EDIT: // edits specified property of student
      if (action.key === 'male') {
        editState[action.key] = action.val;
        editState.female = !action.val;
      } else if (action.key === 'female') {
        editState[action.key] = action.val;
        editState.male = !action.val;
      } else {
        editState[action.key] = action.val;
      }
      return Object.assign({}, state, editState);

    default: return state;

  }

}

/* initializes the selected student/user */
export function setCurStudent(stu) {
  return {
    type: SET,
    payload: stu
  }
}

/* edits specified property of student */
export function editCurStudent(key, val) {
  return {
    type: EDIT,
    key: key,
    val: val
  }
}
