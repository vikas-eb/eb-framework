import * as userTypes from '../actionTypes/userTypes';

const initialState = {
    user: {},
    status: 'guest', // Guest, Rejected, Wrong Password, Registered, Logged In, Logging
    error: {},
};


const authReducer = (state, action) => {
    if (typeof state === 'undefined' ) {
        return initialState;
    }

    switch(action.type){
        case userTypes.INITIALIZE:
            return initialState;

        case userTypes.LOGIN: //requesting login
            return {
                status: 'logging',
                user: action.user
            };

        case userTypes.LOGIN_REQUESTED:
            return {
                status: 'requested',
                user: action.user
            };

        case userTypes.LOGIN_SUCCESS:
            return {
                status: 'loginSuccess',
                user: action.user
            };

        case userTypes.LOGGED_IN:
            return {
                status: 'loggedIn',
                user: action.user
            };

        case userTypes.LOGIN_REJECTED:
            return {
                status: 'rejected',
                user: {},
                error: action.error
            };

        case userTypes.LOGIN_ERROR:
            return {
                status: 'error',
                user: {},
                error: action.error
            };

        case userTypes.LOGOUT:
            return {
                status: 'logOut',
                user: {}
            };

        default:
            return state;
    }

};


export default authReducer;
