import * as sessionManager from './sessionManager';
import { config } from '../util/config';


export const getTokenHeader = (guarded) => {
    return {
       'x-access-token': guarded ? sessionManager.getToken() : config.OPR_KEY
    };
};


export const getUserHeader = () => {
    return {
       'user-id': sessionManager.getLoggedUserId()
    };
};


export const getJSONHeader = () => {
    return {
       'content-type': 'application/json'
    };
};


export const getOPRHeader = () => {
    return {
        'x-access-token': config.OPR_KEY
     };
};


export const getMandatoryRequestHeaders = (guarded) => {
    const mandatoryUserHeader = getUserHeader();
    const mandatoryTokenHeader = getTokenHeader(guarded);
    const mandatoryJSONHeader = getJSONHeader();

    // inject opr key to avoid any malicious call (weak but some security)
    return guarded ? Object.assign({}, mandatoryTokenHeader, mandatoryUserHeader, mandatoryJSONHeader)
            : Object.assign({}, mandatoryTokenHeader, mandatoryJSONHeader);
};


export const includeMandatoryRequestHeaders = (headers) => {
    return Object.assign(headers, getMandatoryRequestHeaders());
};


export const validateEmailFormat = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
};


export const validateNumber = (number) => {
    return typeof number === 'number';
};


export const validateDate = (date) => {
    return isNaN(Date.parse(date));
};

/**
 * 
 * @param {*} password the password which needs to be validated
 * 
 * returns a boolean confirming if the supplied password is a valid password or not. Ideally, the password should be minimum 8 characters and should consist 1 capital case, 1 lowe case letter, 1 number, and 1 special character
 */
export const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return password.length > 7 && regex.test(String(password).toLowerCase());
};


/**
 * 
 * @param {*} file file will be the object retreived from the input type = file tag
 * 
 * returns if the selected file is a valid image or not
 */
export const isValidImage = (file) => {
   const typeArray = file.type.split('/');
   return typeArray.length === 2 && typeArray[0] === 'image';
};


/**
 * 
 * @param {*} file file will be the object retreived from the input type = file tag
 * 
 * returns the extension of the file
 */
export const getExtension = (file) => {
    const lastDotIndex = file.name.lastIndexOf('.');
    return file.name.substring(lastDotIndex + 1);
};