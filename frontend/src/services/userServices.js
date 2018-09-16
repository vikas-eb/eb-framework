import { constants } from '../util/constants';
import { token, save, saveImage, getList } from './api.base';


export const login = (userName, password) => {
    return token(`${constants.API_URL}/token`, {
        userName, 
        password
    });
};


export const register = (user) => {
    return save(`${constants.API_URL}/opr/register`, user, false);
};


export const uploadPic = (image) => {
    debugger;
    return saveImage(`${constants.API_URL}/opr/imageupload`, image, false);
};


export const getUsers = () => {
    getList(`${constants.API_URL}/api/user/1`, {}, false).then(result => {
        console.log('haylo: ', result);
    }).catch(error => {
        console.log('the error is: ', error);
    });
};