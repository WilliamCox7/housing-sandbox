import { combineReducers } from 'redux';
import user from './reducers/userReducer';
import campus from './reducers/campusReducer';
import filter from './reducers/filterReducer';
import apartment from './reducers/apartmentReducer';
import student from './reducers/studentReducer';
import workorders from './reducers/workOrderReducer';
import portal from './reducers/portalReducer';

export default combineReducers({
  user, campus, filter, apartment, student, workorders, portal
});
