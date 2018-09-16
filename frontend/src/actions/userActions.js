import * as userTypes from '../actionTypes/userTypes';
import * as userService from '../services/userServices';


const loginRequest = (userName) => ({
    type: userTypes.LOGIN_REQUESTED,
    user: userName
});


const loginSuccess = (user) => ({
    type: userTypes.LOGIN_SUCCESS,
    user
});


const loginRejected = (error) => ({
    type: userTypes.LOGIN_REJECTED,
    error
});

const userLoggedIn = () => ({
    type: userTypes.LOGGED_IN
});


const loginError = (error) => ({
    type: userTypes.LOGIN_ERROR,
    error
});


export const login = (userName, password) => dispatch => {
    dispatch(loginRequest(userName));
    const promise = userService.login(userName, password);

    promise.then(user => {
        if (user && !user.errorMessage) {
            dispatch(loginSuccess(user));
        } else {
            dispatch(loginRejected(new Error(user.errorMessage))); 
        }
    }).catch(error => {
        dispatch(loginError(error));
    });
};


export const errored = (error) => dispatch => {
    dispatch(loginError(error));
};


export const loggedIn = () => dispatch => {
    dispatch(userLoggedIn());
};


export const register = user => dispatch => {
    dispatch({
        type: userTypes.REGISTERING,
    });

    //code for registering.

    // first we will upload the image

    // image data will only be populated if the user will change the image

    if (user.imageData) {
        uploadImage(user.imageData).then(result => {
            console.log('image: ', result);
            delete user.imageData;
            user.profilePic = result;
            // now register
            userRegister(user, dispatch);
        }).catch(error => {
            dispatch({
                type: userTypes.PROFILE_PIC_UPLOAD_ERROR,
                error
            });
        });
        ;
    }
    else {
        userRegister(user, dispatch);
    }
};


const userRegister = (user, dispatch) => {
    userService.register(user).then(data => {
        if (data && !data.errorMessage) {
            dispatch({
                type: userTypes.REGISTERED,
                user: data.data
            });
        } else {
            dispatch({
                type: userTypes.REGISTRATION_ERROR,
                error: new Error(data.errorMessage)
            }); 
        }

    }).catch(error => {
        dispatch({
            type: userTypes.REGISTRATION_ERROR,
            error
        })
    });
};


export const uploadImage = (fileData) => {
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


export const initialize = () => dispatch => {
    dispatch({
        type: userTypes.INITIALIZE
    });
};


export const Users = () => dispatch => {
    userService.getUsers();
}