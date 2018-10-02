const express = require('express');
const router = express.Router();
const dal = require('../data/dal');
const db = require('../models/index').db;
const controller = require('../controllers/user');


/* GET users listing. */
router.post('/', function (req, res, next) {

	dal.getList(db.User,
		req.body.where,
		req.body.order,
		req.body.include,
		req.body.rowsToReturn,
		req.body.pageIndex,
		req,
		res);
});


router.post('/save', (req, res) => {
	console.log('saving data: ');
	dal.saveData(db.User, req.body, req, res);
});


router.post('/:id', function (req, res, next) {
	if (!req.body.where) {
		req.body.where = [];
	}

	req.body.where.push({ Id: req.params.id});

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
