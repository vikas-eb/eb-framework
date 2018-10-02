const jimp = require('jimp');
const path = require('path');
const logger = require('./logger');
const uuid = require('uuid/v4');
const config = require('../config').config;


/**
 * Credits:
 *      user: kip - https://stackoverflow.com/users/18511/kip
 *      url: https://stackoverflow.com/a/1214753/18511
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * 
 * 
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
const dateAdd = (date, interval, units) => {
	var ret = new Date(date); //don't change original date
	var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };

	switch (interval.toLowerCase()) {
		case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
		case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
		case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
		case 'week': ret.setDate(ret.getDate() + 7 * units); break;
		case 'day': ret.setDate(ret.getDate() + units); break;
		case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
		case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
		case 'second': ret.setTime(ret.getTime() + units * 1000); break;
		default: ret = undefined; break;
	}
	return ret;
};

/**
 * @param {Boolean} useTime returns the string including time
 * @param {Boolean} useMillis returns the string including milliseconds
 * returns a string looking like date
 */
const getNowObject = (useTime, useMillis) => {
	const date = new Date();
	let month = '' + (date.getMonth() + 1);
	let day = '' + date.getDate();
	const year = date.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	if (useTime === true) {
		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();
		let millisecond = date.getMilliseconds();

		if (hour.length < 2) hour = '0' + hour;
		if (minute.length < 2) minute = '0' + minute;
		if (second.length < 2) second = '0' + second;
		if (millisecond.length < 2) millisecond = '0' + millisecond;

		if (useMillis) {
			return [year, month, day, hour, minute, second, millisecond].join('.');
		}
		else {
			return [year, month, day, hour, minute, second].join('.');
		}
	}
	else {
		return [year, month, day].join('.');
	}

};

/**
 * 
 * @param {*} prefix 
 * @param {*} suffix 
 * 
 * returns a uuid v4, and the prefix and suffix are injected
 */
const getRandomSalt = (prefix, suffix) => {
	if (!prefix) prefix = '';
	if (!suffix) suffix = '';

	return prefix + uuid() + suffix;
};


/**
 * initializes app with default variables
 */
const initApp = () => {
	try {
		var fileName = path.resolve(__dirname, '..') + '/logs/logs.' + getNowObject(false, false) + '.txt';

		logger.init(fileName, 'letsdev.errors@gmail.com', 'no-reply@edgebits.com');
		logger.log('initializing app', '\n\n--Program Started--', '', 1, false);
	} catch (error) {
		console.log('e: ', error);
		logger.logError('initializing app', '', error, false);
	}
};


const isNullOrEmpty = val => {
	if (val != "" && val != undefined && val != null) {
		return val;
	} else
		return 0;
};


/**
 * 
 * @param {String} fileName The name of the file to be resized
 * @param {String} newFileName The name of the file to be saved as after resizing
 * @param {String} returnPath The path to be returned to be saved in DB so it can be referenced later on
 * 
 * 
 * returns a promise with either an error if rejects, or the file name when it is successful
 */
const resizeFile = (fileName, newFileName, returnPath) => {
	return new Promise((resolve, reject) => {
		jimp.read(fileName, function (err, lenna) {
			if (err) reject(err);
			lenna.resize(120, 120)
				.write(newFileName, () => {
					// returns the new path
					resolve(returnPath);
				});
		});
	});
};


const drillDownErrorMessage = (error) => {
	var errorMessage = error.message;

	if (error.errors && error.errors.length > 0) {
		error.errors.forEach(err => {
			if (err.message) {
				errorMessage = errorMessage + '. ' + err.message;
			}
		});
	}

	return errorMessage;
};


const base64Decode = (textToDecode) => {
	return Buffer.from(textToDecode, 'base64').toString('utf8');
};


const isOprVerified = (opr) => {
	return config.OPR_KEY === opr;
};


exports.dateAdd = dateAdd;
exports.getNowObject = getNowObject;
exports.base64Decode = base64Decode;
exports.drillDownErrorMessage = drillDownErrorMessage;
exports.resizeFile = resizeFile;
exports.isNullOrEmpty = isNullOrEmpty;
exports.initApp = initApp;
exports.getRandomSalt = getRandomSalt;
exports.isOprVerified = isOprVerified;
