import { constants } from '../util/constants';
import { token, post, postImage, getList } from './api.base';


export const login = (userName, password) => {
    return token(`${constants.API_URL}/token`, {
        userName, 
        password
    });
};


export const register = user => {
    return post(`${constants.API_URL}/opr/register`, user, false);
};


export const saveUser = user => {
    return post(`${constants.API_URL}/api/user/save`, user, true);
};


export const uploadPic = (image) => {
    return postImage(`${constants.API_URL}/opr/imageupload`, image, false);
};


export const checkIfEmailExists = (email) => {
    return post(`${constants.API_URL}/opr/userExists`, { email }, false);
};


export const verifyActivationHash = (activationHash) => {
    return post(`${constants.API_URL}/opr/verifyActivationHash`, { activationHash }, false);
};


export const resetPassword = email => {
    return post(`${constants.API_URL}/opr/forgotpassword`, { email }, false);
};


