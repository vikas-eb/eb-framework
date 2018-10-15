const jwt = require('jsonwebtoken');
const responseHelper = require('../../util/response.helper');
const config = require('../../config');
const user = require('../../controllers/user');

const getToken = (req, res) => {
    user.getUser(req.body.userName, req.body.password).then((user, error) => {
        if (error) {
            // error found, just pass it through
            responseHelper.error(res, error);
            return;
        }
        else {

            try {
                // check if user found
                if (typeof user === 'undefined' || !user || !user.dataValues) {
                    responseHelper.error(res, new Error('Username or Password do not match'), 521);
                    return;
                }

                // user found. Generate token here
                const userWrapper = {
                    userId: user.Id,
                    userName: user.Email,
                    name: user.FirstName + ' ' + user.LastName,
                    injectedKey: config.config.INJECTED_KEY
                };

                // delete password just in case, or do it with attributes in sequelize
                const userClonned = JSON.parse(JSON.stringify(user.dataValues));
                delete userClonned.Password;

                const token = jwt.sign(userWrapper, config.config.SECRET, {
                    expiresIn: config.config.TOKEN_ALLOWED_FOR_HOW_LONG
                });

                userClonned.token = token;
                responseHelper.success(res, 200, userClonned, '', -1);
            }
            catch (error) {
                responseHelper.error(res, error);
                return;
            }
        }
    });
};

/**
 * @param {TEXT} key the key will be like this: /api/user/save
 * @param {Object} body body of the request
 * @param {NUMBER} requestorId the id of the calling person
 * 
 * this function will be the heart of access management. It will check both at record level, and at module level
 */

const findIfUserHasAccessToRequestedMethod = (key, body, requestorId ) => {
    const userAccess = require('../../controllers/userAccess');
    const keys = key.split('/');

    const promiseHelper = (promise, resolve, reject) => {
        return promise.then(result => resolve(result)).catch(error => reject(error));
    };

    return new Promise((resolve, reject) => {
        if (keys.length < 4) {
            // wrong url format. No access can be derived
            return reject(new Error('Invalid request. The Url is malformed'));
        }
    console.log('key: ', keys);
        const moduleName = keys[2];
        const requestType = keys[3];
    
        switch(key) {
            case '/api/user/save':
                //user can save his own info

                if (id === requestorId) {
                    // same user id, you are saving your own info. Fine with us :)
                    resolve('verified');
                }
                else {
                    // wrong info. Check if the request is raised by the user who has access to this module save
                    return promiseHelper(userAccess.findIfUserHasAccessToModule('user', requestorId), resolve, reject);
                }
            
                break;
            default:
                console.log('hey, I am accessing: ' +  moduleName + ' for id: ', requestorId);
                return promiseHelper(userAccess.findIfUserHasAccessToModule(moduleName, requestorId), resolve, reject);
        }
    });
};


const entry = (req, res, next) => {

    // give provision to receive the token from body, query or from headers.

    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.config.SECRET, function (err, decoded) {

            if (err) {
                // the error while decoding the token
                responseHelper.error(res, err);
                return;
            }
            else {

                // decoded data should match with the injected key 

                if (decoded.injectedKey !== config.config.INJECTED_KEY) {
                    //invalid token
                    responseHelper.invalidToken(res);
                    return;
                }

                // token is good. let's go ahead with our implementation

                // make sure to set the opr request to false, so we can identify that the access needs to be verified for this request
                req.oprRequest = false; 
                req.userId = decoded.userId;

                // make sure the access is correct for the call.

                if (req.body.rowsToReturn === 10000) {
                    // request for dropdowns, we don't need to check the access as we have decided to open dropdowns
                    next();
                }
                else {
                    findIfUserHasAccessToRequestedMethod(req.originalUrl, req.body, decoded.userId).
                    then(access => {
                        // add the access detail.
                        req.access = access.dataValues;
                        next();
                    }).catch(error => responseHelper.error(res, error));
                }
            }
        });
    }
    else {
        // unauthorized
        responseHelper.unauthorized(res);
    }

};


module.exports.getToken = getToken;
module.exports.entry = entry;