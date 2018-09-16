const logger = require('./logger');

const jsonFormat = {
    code: -1,
    success: false,
    message: '',
    data: [],
    baseId: -1,
    error: {},
    sentAt: '' 
};


const sendResponse = (res, data) => {
    res.json(data);
};


const unauthorized = res => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = 403;
    json.message = 'Unauthorized. Please login first';

    sendResponse(res, json);
};


const invalidToken = res => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = 403;
    json.message = 'Invalid Token. Token may have been expired or altered with. Please relogin and try again';

    sendResponse(res, json);
};


const success = (res, code, data, message, baseId) => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = code;
    json.success = true;
    json.data = data;
    json.message = message;
    json.baseId = baseId;
    json.sentAt = new Date();
    sendResponse(res, json);
};


const error = (res, error, errorCode, source) => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = errorCode ? errorCode : 502;
    json.message = error.message;
    json.error = error;

    console.log('error: ', error);

    logger.logError('', '', error, true);
    sendResponse(res, json);
};


const unChanged = res => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = 304;
    json.success = true;
    json.data = [];

    sendResponse(res, json);
};

module.exports.error = error;
module.exports.unauthorized = unauthorized;
module.exports.success = success;
module.exports.invalidToken = invalidToken;
module.exports.unChanged = unChanged;