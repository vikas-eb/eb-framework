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
                if (typeof user === 'undefined' || !user || !user.dataValues ) {
                    responseHelper.error(res, new Error('Username or Password do not match'), 521);
                    return;
                }
                
                // user found. Generate token here
                const userWrapper = {
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
            catch(error) {
                responseHelper.error(res, error);
                return;
            }
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
                next();
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