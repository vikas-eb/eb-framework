var fso = require('fs');
const util = require('./helper');
const responseHelper = require('./response.helper');

const checkFileExists = (path) => {
	return new Promise(resolve => {
		fso.exists(path, function (exists) {
			resolve(exists);
		});
	});
};

var multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		req.body.fileName = file.fieldname + '-' + Date.now() + '.' + req.body.extension;
		cb(null, req.body.fileName);
	}
});


var upload = multer({ storage: storage });


const init = app => {
	app.post('/opr/imageUpload', upload.single('avatar'), function (req, res) {
		console.log('love you: ', req.body);
		if (!util.isOprVerified(req.body.oprKey)) {
			// unauthorized, delete the file
			responseHelper.unauthorized(res);
		}
		else {
			responseHelper.success(res, 200, req.body.fileName, 'Image uploaded successfully');
		}
	});
};

module.exports.checkFileExists = checkFileExists;
module.exports.init = init;

