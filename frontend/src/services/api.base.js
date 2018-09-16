import uuid from 'uuid/v4';
import * as util from '../util/util';
import { config } from '../util/config';


const collectionData = {};


const validateResponse = (response) => {
    return response.text().then((responseText) => {
        console.log('data: ', responseText);
        const responseData = JSON.parse(responseText)
        return responseData;
    });
};


/**
 * 
 * @param {String} url the url to load the values from 
 * @param {Object} body the body, like the date range, etc
 * @param {Boolean} forDropdown if true, we will send server to return like 10000 rows so it returns all the values
 */
export const getList = (url, postData, forDropdown) => {
    const headers = util.getMandatoryRequestHeaders();
    let body = JSON.parse(JSON.stringify(postData));

    if (!body || body === {}) {
        body = {
            where: [],
            order: [],
            pageIndex: 0
        };
    }

    if (!(body.where && Array.isArray(body.where) && body.where.length > 0)) {
        body.where = [{
            Active: 1
        }];
    }

    if (!(body.order && Array.isArray(body.order) && body.order.length > 0)) {
        body.order = [];
    }


    if (!(body.pageIndex && body.pageIndex > 0))
        body.pageIndex = 0;

    if (forDropdown) {
        body.rowsToReturn = 10000;
        body.order = ['Email'];
        body.lastSent = collectionData[url] ? collectionData[url].date : '';
    }

    const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
        .then(validateResponse)
        .then(data => {
            // the success should be true, otherwise there is a problem
            if (data.success === true) {

                if (forDropdown) {
                    // if collection not modified, please return a collection from scratch
                    if (data.code === 304) {
                        // try to return 
                        const dataFromCache = collectionData[url].data || [];
                        return resolve(dataFromCache);
                    }
                    else {
                        // store in the cache
                        collectionData[url] = {
                            date: data.sentAt,
                            data: data.data
                        };

                        return resolve(data);
                    }
                }

                return resolve(data);
            }
            else {
                return resolve({
                    success: false,
                    errorMessage: data.message,
                    errorCode: data.code
                });
            }
        })
        .catch(error => reject(error));
    });
};


export const token = (url, body) => {
   const requestOptions = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
    };

    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
        .then(validateResponse)
        .then(data => {
            // the success should be true, otherwise there is a problem
            if (data.success === true) {
                return resolve(data);
            }
            else {
                console.log(`data received from the token: `, data);

                return resolve({
                    success: false,
                    errorMessage: data.message,
                    errorCode: data.code
                });
            }
        })
        .catch(error => reject(error));
    });
};


const save_override = (url, requestOptions) => {
    console.log('ooo:', requestOptions);
    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
        .then(validateResponse)
        .then(data => {
            // the success should be true, otherwise there is a problem
            if (data.success === true) {
                return resolve(data);
            }
            else {
                console.log(`faulty data received from the save: `, data);

                /**
                 * I am intentionally not rejecting it
                 * There may be some situations which are not errors, but not success either and we may want to handle it differently than errors. For example, a message from API. We may want to do different actions on the basis of error codes, so it will help us segregating the rejection from this type of errors.
                 */

                return resolve({
                    success: false,
                    errorMessage: data.message,
                    errorCode: data.code
                });
            }
        })
        .catch(error => reject(error));
    });
};


/**
 * @param {String} url url to save the data to
 * @param {String} body the data to be saved
 * @param {Boolean} guarded mostly true, it will mean that we will need to include the auth token from session manager. If false, means it's a request where we don't need auth, for example, forgot password or register
 */
export const save = (url, body, guarded) => {
    const requestOptions = {
        method: 'POST',
        headers: util.getMandatoryRequestHeaders(guarded),
        body: JSON.stringify(body)
    };

    return save_override(url, requestOptions);
};


/**
 * @param {String} url url to save the data to
 * @param {String} body the data to be saved
 * @param {Boolean} guarded mostly true, it will mean that we will need to include the auth token from session manager. If false, means it's a request where we don't need auth, for example, forgot password or register
 */
export const saveImage = (url, image, guarded) => {
    const formData = new FormData();

    if (!util.isValidImage(image)) {
        return new Promise((_, reject) => {
            reject(new Error('Invalid file type. File should be image'));
        });
    }

    formData.append('oprKey', config.OPR_KEY);
    formData.append('extension', util.getExtension(image));
    formData.append('avatar', image);

    const requestOptions = {
        method: 'POST',
        body: formData
    };

    return save_override(url, requestOptions);
};


