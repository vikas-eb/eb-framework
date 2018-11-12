const db = require('../models').db;
const chai = require('chai');

describe("Sequelize tests", () => {
    it("Sequelize connects fine", (done) => {
        db.authenticate().then(result => {
            chai.assert(typeof result === 'undefined', 'Cannot connect to squelize');
            done();
        }).catch(error => done(error));
    }).timeout(10000);
});