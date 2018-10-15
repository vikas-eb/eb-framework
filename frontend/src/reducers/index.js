import { combineReducers } from 'redux';
import userReducer from './userReducer';
import tableReducer from './tableReducer';
import accessManagementReducer from './accessManagementReducer';

export default combineReducers({
    userReducer,
    accessManagementReducer,
    tableReducer
});