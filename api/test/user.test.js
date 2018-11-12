const user = require('../controllers/user');
const model = require('../models/').db.User;
const dal = require('../data/dal');
const chai = require('chai');

describe("user tests", () => {
    chai.should();

    it("invalid user fails", (done) => {
        user.getUser('','').then(user => {
            chai.assert(user === null, 'Test failed for invalid user. Red Flag');
            done();
        }).catch(error => {
            done(error);
        });
    }).timeout(5000);


    it("valid user succeeds", (done) => {
        user.getUser('k@gmail.com','k123').then(user => {
            chai.assert(typeof user !== 'undefined', 'User is undefined');
            chai.assert(typeof user.Id !== 'undefined', 'User is undefined');
            chai.assert(user.Active === true, 'User is inactive' );
            chai.assert(user.Id.length === 36, 'Invalid guid');
            done();
        }).catch(error => {
            done(error);
        });
    }).timeout(5000);


    it("create user succeeds", (done) => {

        const userData = {
            Email: 'v.ik.a.s.b.h.a.n.d.ari.2@gmail.com',
            Password: 'password',
            Phone: '1122111211',
            State: 'UP',
            City: 'Noida',
            CreatedBy: 0,
            Active: 1
        };

        dal.saveData(model, userData, { 
            oprRequest: true,
            session: {}
        }).then(user => {
            chai.assert(typeof user !== 'undefined', 'User is undefined');
            chai.assert(typeof user.Id !== 'undefined', 'User is undefined');
            chai.assert(user.Active === true, 'User is inactive' );
            chai.assert(user.Id.length === 36, 'Invalid guid');
            done();
        }).catch(error => {
            done(error);
        });
    }).timeout(5000);
});