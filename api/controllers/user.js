const db = require('../models/index').db;
const dal = require('../data/dal');
const uuid = require('uuid/v4');
const email = require('../util/email');
const codes = require('../util/codes').codes;
const responseHelper = require('../util/response.helper');
const template = require('../templates');
const helper = require('../util/helper')


const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        db.User.findOne({
            where: {
                Email: email,
                Password: db.sequelize.literal(`BINARY Password = '${password}'`),
                Active: 1
            },
            attributes: { exclude: ['Password, ActivationHash, PasswordHash'] }
        }).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
};


const register = (req, res) => {
    const hash = uuid();
    const user = req.body;

    // the user will be activated as soon as he has confirmed his email.
    user.Active = 0;
    user.ActivationHash = hash;

    dal.saveData(db.User, user, req).then(user => {
        // send email
        email.sendEmailWithTemplate(res, 'register', user.FirstName, hash, user.Email, 'User registered successfully. Please check your email to activate your account.');
    }).catch(error => responseHelper.error(res, error, codes.ERROR));
};


const saveUser = (req, res) => {
    
};


const userExists = (req, res) => {
    const where = [];
    where.push({ Email: req.body.email });

    dal.getList(db.User, where).then(result => {
        console.log('data: ', result);
        if (result.rows.length === 0) {
            // no user found
            responseHelper.success(res, codes.SUCCESS, { found: false }, 'User email not found');
        }
        else {
            responseHelper.error(res, new Error('Email already exists'), codes.EMAIL_ALREADY_EXISTS);
        }
    }).catch(error => responseHelper.error(res, error, codes.ERROR));
};


const verifyActivationHash = (req, res) => {
    const where = [];
    where.push({ ActivationHash: req.body.activationHash });

    dal.getList(db.User, where).then(result => {
        if (result.rows.length > 0) {
            //user found

            const dataToSave = {
                ActivationHash: '',
                Active: 1,
                Id: result.rows[0].Id
            };

            dal.saveData(db.User, dataToSave, req).then(nextResult => {
                responseHelper.success(res, codes.SUCCESS, { found: true });
            }).catch(error =>{
                responseHelper.error(res, error, codes.ERROR);
            });
        }
        else {
            responseHelper.error(res, new Error('Invalid Code'), codes.ACTIVATION_HASH_WRONG);
        }
    }).catch(error => responseHelper.error(res, error, codes.ERROR));
};


const verifyPasswordHash = (req, res) => {
    const where = [];
    where.push({ Password: req.body.passwordHash });

    dal.getList(db.User, where).then(result => {
        if (result.rows.length > 0) {
            // user found

            // let's make sure that the password is not expired



            const dataToSave = {
                ActivationHash: '',
                Active: 1,
                Id: result.rows[0].Id
            };

            dal.saveData(db.User, dataToSave, req).then(nextResult => {
                responseHelper.success(res, codes.SUCCESS, { found: true });
            }).catch(error =>{
                responseHelper.error(res, error, codes.ERROR);
            });
        }
        else {
            responseHelper.error(res, new Error('Invalid Code'), codes.ACTIVATION_HASH_WRONG);
        }
    }).catch(error => responseHelper.error(res, error, codes.ERROR));
};


const forgotPassword = (req, res) => {
    const where = [];
    where.push({ Email: req.body.email });

    dal.getList(db.User, where).then(result => {
        if (result.rows.length > 0) {
            //user found. First create the password hash and save it to the user table and the time it should be valid till
            const passwordHash = uuid();
            const validTill = helper.dateAdd(new Date(), 'hours', 24);

            const user = {
                Id: result.rows[0].Id,
                PasswordHash: passwordHash,
                PasswordHashValidTill: validTill
            };

            // save it to the db
            dal.saveData(db.User, user, req).then(success => {
                //user is saved, now send email to user
                email.sendEmailWithTemplate(res, 'resetPassword', result.rows[0].FirstName, passwordHash, result.rows[0].Email, 'Password reset request received. Please check your email for further instructions.');
            })
            .catch(error => responseHelper.error(res, error, codes.ERROR));
        }
        else {
            responseHelper.error(res, new Error('Email does not exist'), codes.EMAIL_DOESNOT_EXIST);
        }
    });
}


module.exports.getUser = getUser;
module.exports.saveUser = saveUser;
module.exports.register = register;
module.exports.exists = userExists;
module.exports.verifyActivationHash = verifyActivationHash;
module.exports.verifyPasswordHash = verifyPasswordHash;
module.exports.forgotPassword = forgotPassword;