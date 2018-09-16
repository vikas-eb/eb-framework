const db = require('../models').db;

describe("user tests", () => {
    it("Sequelize connects fine", (done) => {
        db.authenticate().then(result => {
            done();
        }).catch(error => done(error));
    }).timeout(10000);
});