const Sequelize = require('sequelize');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const model = require('../models/user');

const sequelize = new Sequelize(
    config.config.ENVIRONMENT === 'dev' ? config.sequelizeConfig.dev : config.sequelizeConfig.prod
);


const db = {};

const authenticate = () => {
    return sequelize.authenticate();
};

// load the models

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });


Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


// set up the relationship here

/*** model.belongsTo(anotherModel) ***/

db.User.belongsTo(db.AccessType);
db.GroupAccess.belongsTo(db.AccessGroup);
db.UserAccess.belongsTo(db.User);


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.authenticate = authenticate;


// return db objects here

module.exports.db = db;
