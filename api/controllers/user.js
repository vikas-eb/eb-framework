const db = require('../models/index').db;
const dal = require('../data/dal');
const user = require('../models').User;

const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        db.User.findOne({
            where: {
                Email: email,
                Password: db.sequelize.literal(`BINARY Password = '${password}'`),
                Active: 1
            }
        }).then(user => {
            resolve(user);
        }).catch(error => {
            reject(error);
        });
    });
};


const saveUser = (req, res) => {
    dal.saveData(user, req.body, res);
};


module.exports.getUser = getUser;
module.exports.saveUser = saveUser;