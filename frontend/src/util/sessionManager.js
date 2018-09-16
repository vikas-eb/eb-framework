
import * as encryption from './encryption'
import { config } from './config';
import { sessionKeys } from './sessionKeys';

const encrypt = config.USE_ENCRYPTION;


export const clear = () => {
    localStorage.clear();
}


const saveInSession = (key, value) => {
    localStorage.setItem(key, (encrypt === true) ? encryption.encryptText(value): value );
};


const getFromSession = (key) => {
    const item = localStorage.getItem(key);
console.log('thats how it should look like: ', encryption.decryptText(item));
    return (encrypt === true ? encryption.decryptText(item): item);
};


export const getLoggedUser = () => {
    const loggedUserJSON = getFromSession(sessionKeys.LOGGED_USER);
    console.log('user: ', loggedUserJSON);
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : {};
};


export const getLoggedUserEmail = () => {
    return getFromSession(sessionKeys.LOGGED_USER_EMAIL);
};


export const saveUser = (user) => {
    saveInSession(sessionKeys.LOGGED_USER, JSON.stringify(user));
};


export const saveEmail = (email) => {
    saveInSession(sessionKeys.LOGGED_USER_EMAIL, JSON.stringify(email));
};


export const getToken = () => {
    return localStorage.getItem(sessionKeys.TOKEN);
};


export const saveToken = (token) => {
    return localStorage.setItem(sessionKeys.TOKEN, token);
};


export const getLoggedUserId = () => {
    const loggedUser = getLoggedUser();
    return loggedUser ? loggedUser.id : '';
};

export const isLoggedIn = () => {
    return !!getLoggedUser();
};