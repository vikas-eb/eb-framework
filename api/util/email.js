const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
	service: 'gmail',
	auth: {
		   user: 'letsdevindia@gmail.com',
		   pass: 'Winter1011'
	   }
});


/**
 * @param {String} to the {comma separated} email addresses to be included in To
 * @param {String} cc the {comma separated} email addresses to be included in cc
 * @param {String} subject subject of email
 * @param {String} html html body
 * @param {Array} attachments attachments to be included
 */
const sendEmail = (to, cc, subject, html, attachments) => {
	let mailOptions = {
		to,
		cc,
        subject,
        html,
        attachments
	};
	
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(info);
			}
		});
	});
};

exports.sendEmail = sendEmail;
