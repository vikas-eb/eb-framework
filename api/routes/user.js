var express = require('express');
var router = express.Router();
var dal = require('../data/dal');
const db = require('../models/index').db;

/* GET users listing. */
router.post('/', function (req, res, next) {
	console.log('way to go: ', req.session);
	dal.getList(db.User,
		req.body.where,
		req.body.order,
		req.body.include,
		req.body.rowsToReturn,
		req.body.pageIndex,
		req,
		res);
});


router.post('/:id', function (req, res, next) {
	if (!req.body.where) {
		req.body.where = [];
	}

	req.body.where.push({ Id: req.params.id});
	console.log('hey: ', req.body);

	dal.getList(db.User,
		req.body.where,
		req.body.order,
		req.body.include,
		req.body.rowsToReturn,
		req.body.pageIndex,
		req,
		res);
});


module.exports = router;
