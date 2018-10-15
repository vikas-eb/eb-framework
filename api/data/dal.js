const db = require('../models/index');
const config = require('../config').config;
const responseHelper = require('../util/response.helper');
const sessionHelper = require('../util/session.helper');
const helper = require('../util/helper');
const uuid = require('uuid/v4');


/**
 * 
 * @param {db.Sequelize} model the sequelize model
 * 
 * There are times when we dont want to send few columns when we send GetList data. Those attributes will come here.
 */
const getExcludedAttributes = model => {
    switch(model.name.toLowerCase()) {
        case 'user':
            return { exclude: ['Password, ActivationHash, PasswordHash'] };
    }

    return {};
};


/**
 * The function will eventually return the list of data for the model asked. It will also filter & sort the data, and will also include the child table(s) data in the list
 *  
 * @param {db.sequelize} model the model on which the operation has to be applied
 * @param {Array} where the filter array. It will be used to filter the results
 * @param {Array} order the sorting array.
 * @param {Array} include the inclusions array
 * @param {Number} pageIndex 0 based index. The index of current page. It will be required to show the active page
 * @param {Request} req Response object to send the response back to the user. If null, the function will
 * @param {Response} res Response object to send the response back to the user. If null, the function will return a Promise
 */
const getList = (model,
                    where,
                    order,
                    include,
                    rowsToReturn, // send like 10000 so it gives all the records for dropdowns
                    pageIndex, // 0 based infxed
                    req,
                    res) => {
    const promise = new Promise((resolve, reject) => {
        try {

            /**
             * for user, please don't return the password and hashes for security
             */

            const excludedAttributes = getExcludedAttributes(model);

            if (!pageIndex) pageIndex = 0;
            if (typeof rowsToReturn === 'undefined') rowsToReturn = config.DB_ROWS_LIMIT;

            /**
            * here I will add the logic so it should return the master values only if it has changed since stored last time. It only applies for master values
            */

            if (rowsToReturn === 10000) {
                 // this is for master / dropdown
                 if (sessionHelper.collectionDirty(req, model, req.body.lastSent)) {
                     // dirty, fetch collection
                     // Please read carefully here: I am restricting the collection to be obtained only with two values, Id and Name. The reason for doing this is that I don't want to open all the values of column to the users. For example, a user may have access to collection of user, for, say assigning a task to a particular user, but they won't have access to User data. In a generic world, it is difficult to differentiate the requests otherwise

                     model.findAndCountAll({
                        include,
                        attributes: req.body.NameField ? ['Id'].concat(req.body.NameField.split(',')) : ['Id', 'Name'],
                        where,
                        order: req.body.NameField ? req.body.NameField.split(',') : ['Name'],
                    }).then(result => resolve(result))
                    .catch(error => reject(error))
                }
                else {
                    resolve({ code: 304 });
                }
            }
            else {
                // it is not a dropdown request, please use the access of the user to identify what kind of data has to be returned

                // if opr request is set to true, it means the request has come from the open routes. No need to check access as we need to hit save for that
                if (req && req.oprRequest === false) {
                    const myRecordsAccess = req.access.MyRecordsAccess || 0;
                    const otherRecordsAccess = req.access.OtherRecordsAccess || 0;

                    if (myRecordsAccess === 0 && otherRecordsAccess === 0) {
                        // no access for any get records
                        return reject(helper.generateWarning(`You don't have access to ${model.name} module.`));
                    }

                    if (otherRecordsAccess > 0 && otherRecordsAccess < 16) {
                        // the user has access to other user records so it doesn't matter who created it
                        // we will just continue with default filters requested by front end
                    }
                    else if (myRecordsAccess > 0 && myRecordsAccess < 11) {
                        // user doesn't have access to view other's records. Return only those records 
                        where.CreatedBy = req.userId;
                    }
                    else {
                        // no access
                        return reject(helper.generateWarning(`You don't have access to ${model.name} module.`));
                    }

                }



                model.findAndCountAll({
                    include,
                    attibutes: excludedAttributes,
                    where,
                    order,
                    limit: rowsToReturn,
                    offset: pageIndex * rowsToReturn
                }).then(result => resolve(result))
                .catch(error => reject(error))
            }
        }
        catch(error) {
            reject(error);
        }
    });

    if (res) {
        promise.then(result => {
            if (result.code === 304) {
                responseHelper.success(res, 304, []);
            }
            else {
                responseHelper.success(res, 200, result.rows, '', -1, result.count);
            }
        })
        .catch(error => {
            responseHelper.error(res, error, 502)});
    }
    else {
        return promise;
    }
};


/**
 * @param {*} model the model
 * @param {Int32Array} ids Array of ids to be deleted
 * @param {Number} updatedBy the user calling the shot
 * @param {Request} req Request object to operate session functions
 * @param {Response} res the response object. If supplied, the function will try to send response right away, otherwise it will return a promise
 */
const deleteRecords = (model, ids, updatedBy, req, res) => {
    const promise = new Promise((resolve, reject) => {
        try {
            model.update({
                Active: false,
                UpdatedBy: updatedBy
            },
            {
                where: { Id: ids }
            }).then(result => {
                sessionHelper.change(req, model);
                resolve(result);
            })
            .catch(err => reject(err));
        }
        catch(error) {
            reject(error);
        }
    });

    if (res) {
        promise.then(result => responseHelper.success(res, 200, result, 'Records deleted successfully', res.Id)).catch(error => responseHelper.error(res, error, 502));
    }
    else {
        return promise;
    }
};


/**
 * @param {*} model the model
 * @param {Number} id the id to be deleted
 * @param {Number} updatedBy the user calling the shot
 */
const deleteRecord = (model, id, updatedBy, req, res) => {
    const ids = [];
    ids.push(id);

    return deleteRecords(model, ids, updatedBy, req, res);
};


/**
 * @param {*} model
 * @param {Object} body
 * @param {Response} res if you send res object, it will send a response back. otherwise it will return a promise
 */
const saveData = (model, body, req, res) => {
    const promise = new Promise((resolve, reject) => {
        try {

            // make sure the user has access to this module. User should have access of 5 to insert a record
            const myRecordsAccess = req.access ? req.access.MyRecordsAccess : 0;
            const otherRecordsAccess = req.access ? req.access.OtherRecordsAccess : 0;

            // if id exists, consider it an update
            if (typeof body.Id === 'undefined') {

                if ((myRecordsAccess > 0 && myRecordsAccess < 11) || req.oprRequest) {
                    // in this range, I have access to add a record
                }
                else {
                    // i don't have access to add a record
                    return reject(helper.generateWarning(`You don't have access to save data to ${model.name} module.`));
                }

                // no id given. generate a uuid
                // uuid are generally very safe for a unique Id, but if you want, you can probably add your own prefix or suffix to make sure the uniqueness
                body.Id = uuid();
                body.CreatedBy = req.userId;

                model.create(body).then(result => {
                    sessionHelper.change(req, model);
                    resolve(result);
                }).catch(error => reject(error));
            }
            else {

                // in case of edit, we need to make sure we have the insert access to this module or not, if I do,
                // i should be able to edit my own records.

                // and, if the record is not mine, then I should have access to edit the records

                body.UpdatedBy = req.userId;

                // find the record by Id

                model.findOne({
                    where: { Id: body.Id }
                }).then(result => {
                    if (result) {
                        // you can only edit the record if 
                            // 1. You have at least 10 access in others access
                            // 2. Or, If you don't have 10 in others, you need to have the 5 in myaccess, plus this record should be created by you.
                            // 3. Or, This is an opr Request so no access is required

                            if (otherRecordsAccess >= 10 || req.oprRequest || (myRecordsAccess >= 5 && req.userId === result.CreatedBy)) {
                                // I have access to edit this record

                                return model.update(body, { 
                                    where: {
                                    Id: body.Id
                                }}).then(result => {
                                    sessionHelper.change(req, model);
                                    resolve(result);
                                }).catch(error => reject(error));
                            }
                            else {
                                // No access, ouch :))
                                return reject(helper.generateWarning(`You don't have access to edit a record in ${mode.name} module.`));
                            }
                    }
                    else {
                        // no record found with the id
                        return reject(helper.generateWarning(`No record with id ${body.Id} exists in DB. Unable to edit the record`));
                    }
                }).catch(error => reject(error));
            }
        }
        catch(error) {
            reject(error);
        }
    });

    if (res) {
        promise.then(result => {
            sessionHelper.change(req, model);
            responseHelper.success(res, 200, result, 'Record saved successfully', res.Id);
        }).catch(error => responseHelper.error(res, error, 502));
    }
    else {
        return promise;   
    }
};

module.exports.getList = getList;
module.exports.saveData = saveData;
module.exports.deleteRecords = deleteRecords;
module.exports.deleteRecord = deleteRecord;

