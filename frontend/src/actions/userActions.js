import * as userTypes from '../actionTypes/userTypes';
import * as userService from '../services/userServices';
import { post } from '../services/api.base';


const dispatchAction = (dispatch, type, user, users, error, message, recordsCount) => {
    dispatch({
        type,
        user,
        users,
        message,
        error,
        recordsCount
    });
};


export const login = (userName, password) => dispatch => {
    dispatchAction(dispatch, userTypes.LOGIN_REQUESTED, userName, null , null, null);
    const promise = userService.login(userName, password);

    promise.then(data => {
        if (data && !data.errorMessage) {
            console.log('login data: ', data);
            dispatchAction(dispatch, userTypes.LOGIN_SUCCESS, data.data, null, null, data.message);
        } else {
            dispatchAction(dispatch, userTypes.LOGIN_ERROR, null, null, new Error(data.errorMessage), null);
        }
    }).catch(error => {
        dispatchAction(dispatch, userTypes.LOGIN_ERROR, null, null, error, null);
    });
};


export const errored = (error) => dispatch => {
    dispatchAction(dispatch, userTypes.LOGIN_ERROR, null, null, error, null);
};


export const loggedIn = () => dispatch => {
    dispatchAction(dispatch, userTypes.LOGGED_IN, null, null, null, null);
};


const uploadImage = (fileData) => {
    return new Promise((resolve, reject) => {
        userService.uploadPic(fileData).then(data => {
            if (data && !data.errorMessage) {
                resolve(data.data);
            }
            else {
                reject(new Error(data.errorMessage));
            }
        }).catch(error => {
            console.log(`error while saving image: `, error);
            reject(error);
        });
    });
};


export const saveUser = user => dispatch => {
    //code for registering.

    // first we will upload the image

    // image data will only be populated if the user will change the image

    if (user.ImageData) {
        dispatchAction(dispatch, userTypes.UPLOADING_REQUESTED, null, null, null, null);
        uploadImage(user.ImageData).then(result => {
            delete user.ImageData;
            user.ProfilePic = result;
            // now register
            userSave(user, dispatch);
        }).catch(error => {
            dispatchAction(dispatch, userTypes.UPLOAD_ERROR, null, null, error, null);
        });
        ;
    }
    else {
        userSave(user, dispatch);
    }
};


const userSave = (user, dispatch) => {
    dispatchAction(dispatch, userTypes.SAVE_USER_REQUESTED, null, null, null, null);

    const promise = user.Id > 0 ? userService.saveUser(user) : userService.register(user);

    promise.then(data => {
        if (data && !data.errorMessage) {
            dispatchAction(dispatch, userTypes.SAVE_USER_SUCCESS, data.data, null, null, data.message);
        } else {
            dispatchAction(dispatch, userTypes.SAVE_USER_ERROR, null, null, new Error(data.errorMessage), null);
        }

    }).catch(error => {
        dispatchAction(dispatch, userTypes.SAVE_USER_ERROR, null, null, error, null);
    });
};


export const initialize = () => dispatch => {
    dispatch({
        type: userTypes.INITIALIZE
    });
};


export const checkIfEmailExists = (email) => dispatch => {
    dispatchAction(dispatch, userTypes.EMAIL_CHECK_REQUESTED, null, null, null, null);

    userService.checkIfEmailExists(email).then(data => {
        if (data && !data.errorMessage) {
            dispatchAction(dispatch,
                data.data.found === true ? userTypes.EMAIL_CHECK_EXISTS : userTypes.EMAIL_CHECK_DOES_NOT_EXIST,
                null, null, data.message);
        }
        else {
            dispatchAction(dispatch, userTypes.EMAIL_CHECK_ERROR, null, null, new Error(data.errorMessage), null);
        }
    }).catch(error =>dispatchAction(dispatch, userTypes.EMAIL_CHECK_ERROR, null, null, error, null));
};


export const redirectToLogin = () => dispatch => {
    dispatch({
        type: userTypes.REDIRECTED_TO_LOGIN
    });
};


export const verifyActivationHash = activationHash => dispatch => {
    dispatchAction(dispatch, userTypes.ACTIVATION_HASH_VERIFICATION_REQUESTED, null, null, null, null);

    userService.verifyActivationHash(activationHash).then(data => {
        if (data && !data.errorMessage && data.data.found === true) {
            dispatchAction(dispatch, userTypes.ACTIVATION_HASH_VERIFICATION_VERIFIED, null, null, null, data.message);
        }
        else {
            dispatchAction(dispatch, userTypes.ACTIVATION_HASH_VERIFICATION_NOT_FOUND, null, null, new Error(data.errorMessage), null);
        }
    }).catch(error => dispatchAction(dispatch, userTypes.ACTIVATION_HASH_VERIFICATION_NOT_FOUND, null, null, error, null));
};


export const resetPassword = email => dispatch => {
    dispatchAction(dispatch, userTypes.PASSWORD_RESET_REQUESTED, null, null, null, null);
};

/**
 * @param {object} postData It will have information like what page index, and the ordering or filtering information
 */
export const getUsers = postData => dispatch => {
    dispatchAction(dispatch, userTypes.GET_USERS_REQUESTED, null, null, null, null);

    userService.getUsers(postData).then(data => {
        if (data && !data.errorMessage) {
            dispatchAction(dispatch, userTypes.GET_USERS_SUCCESS, null, data.data, null, data.message, data.recordsCount);
        }
        else {
            dispatchAction(dispatch, userTypes.GET_USERS_ERROR, null, null, new Error(data.errorMessage), null);
        }
    }).catch(error => dispatchAction(dispatch, userTypes.GET_USERS_ERROR, null, null, error, null));
};