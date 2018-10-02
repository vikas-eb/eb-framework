const fs = require('fs');
const path = require('path');
const config = require('../config').config;


/**
 * 
 * @param {*} type the template type, like Register, Change Password
 * @param {*} name the name of the user
 * @param {*} hash the hash for reset password and 
 */
module.exports.getTemplate = (type, name, hash) => {
	let fileName = '';
	let url = '';
	let subject = '';

	switch (type) {
		case 'register':
			fileName = 'register.html';
			url = (config.DEBUG ? config.DEBUG_URL : config.PROD_URL) + '/verify/' + hash;
			subject = 'Verify your Account | EB-Framework';

			break;
		case 'resetpassword':
			fileName = 'resetpassword.html';
			url = (config.DEBUG ? config.DEBUG_URL : config.PROD_URL) + '/resetpassword/' + hash;
			subject = 'Reset your Password | EB-Framework';

			break;
		default:
			break;
	}

	const promise = new Promise((resolve, reject) => {

		fs.readFile(path.join(__dirname, fileName), function (err, data) {
			if (err) {
				reject(err);
			}
			else {
				const body = data.toString('utf8').replace('<%userName%>', name)
					.replace('<%url%>', url);
				resolve({
					subject,
					body
				});
			}
		});
	});

	return promise;
};