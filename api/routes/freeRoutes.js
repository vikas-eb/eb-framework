const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const util = require('../util/helper');
const responseHelper = require('../util/response.helper');


const oprMiddleware = (req, res) => {
    const token = req.headers['x-access-token'] || req.body.oprKey;

    if (!util.isOprVerified(token)) {
        responseHelper.unauthorized(res);
        return false;
    }

    req.oprRequest = true;

    return true;
};


router.post('/register', (req, res) => oprMiddleware(req,res) ? user.register(req, res) : () => {});
router.post('/forgotpassword', (req, res) => oprMiddleware(req,res) ? user.forgotPassword(req, res) : () => {});
router.post('/userExists', (req, res) => oprMiddleware(req,res) ? user.exists(req, res) : () => {});
router.post('/verifyActivationHash', (req, res) => oprMiddleware(req,res) ? user.verifyActivationHash(req, res) : () => {});
router.post('/verifyPasswordHash', (req, res) => oprMiddleware(req,res) ? user.verifyPasswordHash(req, res) : () => {});


module.exports = router;
