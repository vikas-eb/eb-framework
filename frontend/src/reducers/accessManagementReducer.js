import * as accessManagementTypes from '../actionTypes/accessManagementTypes';

const initialState = {
    type: accessManagementTypes.DEFAULT,
    error: {},
    accessInfo: [],
    message: ''
};

const accessManagementReducer = (state, action) => {
    if (typeof state === 'undefined' ) {
        return initialState;
    }

    return {
        type: action.type,
        accessInfo: action.accessInfo,
        message: action.message,
        error: action.error
    };
};


export default accessManagementReducer;

