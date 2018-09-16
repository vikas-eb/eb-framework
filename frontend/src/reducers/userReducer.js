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

    switch (action.type) {
        case userTypes.REGISTRATION_ERROR:
            return {
                type: action.type,
                error: action.error
            };

        case userTypes.REGISTERING:
            return { status: action.type };

        case userTypes.REGISTERED:
            return {
                type: action.type,
                user: action.user
            };

        case userTypes.PROFILE_PIC_UPLOADING:
            return {
                type: action.type
            };

        case userTypes.PROFILE_PIC_UPLOAD_ERROR:
            return {
                type: action.type,
                error: action.error
            };

        default:
            return state;
    }
};


export default userReducer;
