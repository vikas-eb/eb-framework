const db = require('../models/index').db;
const dal = require('../data/dal');
const responseHelper = require('../util/response.helper');
const helper = require('../util/helper')
const op = require('sequelize').Op;
const config = require('../config').config;


module.exports.findIfUserHasAccessToModule = (moduleName, userId) => {
    return new Promise((resolve, reject) => {
        db.UserAccess.findOne({
            where: {
                ModuleName: moduleName,
                UserId: userId,
                Active: 1
            }
        }).then(access => {
            if (access) {
                resolve(access);
            }
            else {
                const error = new Error(`Sorry, you don't have access to ${moduleName} module for completing this request.`);
                error.warning = true;

                reject(error);
            }
        }).catch(error => {
            reject(error);
        });
    });
};



module.exports.getUserAccessDetails = (req, res) => {
    if (!req.body.where) {
		req.body.where = [];
	}

    req.body.where.push({
        UserId: req.userId,
        Active: 1
    });

    const modules = {};

    config.MODULES.forEach(moduleName => {
        modules[moduleName] = {
            MyRecordsAccess: 0,
            OtherRecordsAccess: 0
        };
    });
    
	dal.getList(db.UserAccess,
		req.body.where,
		[],
		[],
		100,
		0,
		req).then(results => {
            if (results) {
                results.rows.forEach(_module => {

                    modules[_module.ModuleName] = {
                        MyRecordsAccess: _module.MyRecordsAccess,
                        OtherRecordsAccess: _module.OtherRecordsAccess,
                    };
                });
            }

            const _modules = [];
            Object.keys(modules).forEach(_module => {
                _modules.push({
                    ModuleName: _module,
                    MyRecordsAccess: modules[_module].MyRecordsAccess,
                    OtherRecordsAccess: modules[_module].OtherRecordsAccess
                });
            });

            console.log('pushed: ', _modules);

            responseHelper.success(res, 200, _modules);
    }).catch(error => responseHelper.error(res, error, 502));
};