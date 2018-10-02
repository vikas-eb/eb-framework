const createError = require('http-errors');
const express = require('express');
const compression = require('compression')
const cors = require('cors')
const middleware = require('./routes/middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileHelper = require('./util/file.helper');
const util = require('./util/helper');
const config = require('./config').config;
const db = require('./models').db;
const responseHelper = require('./util/response.helper');
const session = require('express-session');

  
var app = express();

app.use(session({
	secret: config.ENCRYPTION_SALT,
	resave: true,
	saveUninitialized: true
}));

app.use(cors());
app.options('*', cors())

app.use(compression({ level: 9 }))

app.use('/uploads', express.static('uploads'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// authenticate sequelize

db.authenticate().then(result => {
	console.log(`Sequelize connection successful`);
}).catch(error => {
	console.log(`error found while connecting to sequelize: ${error.message} `, error);
});


// multer init
fileHelper.init(app);


// middleware section ...

app.post('/token', function (req, res) {
	middleware.getToken(req, res);
});


// for middleware, none goes without auth
app.use('/api', function (req, res, next) {
	middleware.entry(req, res, next);
});

// for middleware, none goes without auth
app.use('/opr', require('./routes/freeRoutes'));

/** routing */
app.use('/api/user', require('./routes/user'));

util.initApp();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	responseHelper.error(res, err);
});


module.exports = app;