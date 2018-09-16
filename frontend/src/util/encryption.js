import * as aes from 'crypto-js/aes';
import * as CryptoJS from 'crypto-js';
import * as config from '../util/config';


export const encryptText = (textToEncrypt, key='') => {
    if (key === '') key = config.config.ENCRYPTION_SALT;
    if (!textToEncrypt || textToEncrypt === '') return '';

    return aes.encrypt(textToEncrypt, key);
};


export const decryptText = (textToDecrypt, key='') => {
    if (key === '') key = config.config.ENCRYPTION_SALT;
    if (!textToDecrypt || textToDecrypt === '') return '';
    
    return aes.decrypt(textToDecrypt, key).toString(CryptoJS.enc.Utf8);
};

