const db = require('../models/index');
const config = require('../config').config;
const responseHelper = require('../util/response.helper');
const sessionHelper = require('../util/session.helper');


const getExcludedAttributes = (model) => {
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
 * @param {Number} pageIndex the index of current page. It will be required to show the active page
 * @param {Request} req Response object to send the response back to the user. If null, the function will
 * @param {Response} res Response object to send the response back to the user. If null, the function will return a Promise
 */
const getList = (model,
                    where,
                    order,
                    include,
                    rowsToReturn, // send like 10000 so it gives all the records for dropdowns
                    pageIndex,
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
                     model.findAndCountAll({
                        include,
                        attibutes: excludedAttributes,
                        where,
                        order,
                        limit: rowsToReturn,
                        offset: pageIndex
                    }).then(result => resolve(result))
                    .catch(error => reject(error))
                }
                else {
                    resolve({ code: 304 });
                }
            }
            else {
                model.findAndCountAll({
                    include,
                    attibutes: excludedAttributes,
                    where,
                    order,
                    limit: rowsToReturn,
                    offset: pageIndex
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
                // unmodified
                responseHelper.success(res, 304, []);
            }
            else {
                responseHelper.success(res, 200, result.rows);
            }
        })
        .catch(error => responseHelper.error(res, error, 502));
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
            // if id exists, consider it an update
            if (body.Id > 0) {
                model.update(body, { 
                    where: {
                    Id: body.Id
                }}).then(result => {
                    sessionHelper.change(req, model);
                    resolve(result);
                }).catch(error => reject(error));
            }
            else {
                model.create(body).then(result => {
                    sessionHelper.change(req, model);
                    resolve(result);
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