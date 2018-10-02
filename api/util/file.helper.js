const multer = require('multer');
const fso = require('fs');
const util = require('./helper');
const responseHelper = require('./response.helper');


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		req.body.fileName = file.fieldname + '-' + Date.now() + '.' + req.body.extension;
		cb(null, req.body.fileName);
	}
});


const upload = multer({ storage: storage });


const init = app => {
	app.post('/opr/imageUpload', upload.single('avatar'), function (req, res) {
		if (!util.isOprVerified(req.body.oprKey)) {
			// unauthorized, delete the file
			responseHelper.unauthorized(res);
		}
		else {
			responseHelper.success(res, 200, req.body.fileName, 'Image uploaded successfully');
		}
	});
};


const checkFileExists = (path) => {
	return new Promise(resolve => {
		fso.exists(path, (exists) => resolve(exists));
	});
};


module.exports.checkFileExists = checkFileExists;
module.exports.init = init;

