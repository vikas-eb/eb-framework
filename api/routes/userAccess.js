const express = require('express');
const router = express.Router();
const dal = require('../data/dal');
const db = require('../models').db;
const userAccess = require('../controllers/userAccess');


router.post('/list', function (req, res, next) {
    userAccess.getUserAccessDetails(req, res);
});


module.exports = router;
