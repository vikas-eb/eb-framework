import * as userTypes from '../actionTypes/userTypes';

const initialState = {
        user: {},
        error: {},
        type: userTypes.INITIALIZE,
    };

const userReducer = (state, action) => {
    if (typeof state === 'undefined' ) {
        return initialState;
    }

    return {
        type: action.type,
        user: action.user,
        message: action.message
    };
};


export default userReducer;
