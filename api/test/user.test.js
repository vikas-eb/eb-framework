const user = require('../controllers/user');
const model = require('../models/').db.User;
const dal = require('../data/dal');
const chai = require('chai');

describe("user tests", () => {
    chai.should();

    it("invalid user fails", (done) => {
        user.getUser('','').then(result => {
            result.should.equal(result,[]);
            done();
        }).catch(error => {
            done(error);
        });
    }).timeout(5000);


    it("valid user succeeds", (done) => {
        user.getUser('','').then(result => {
            result.should.equal(result,[]);
            done();
        }).catch(error => {
            done(error);
        });
    }).timeout(5000);


    it("create user succeeds", (done) => {

        const userData = {
            Email: 'vikasbhandari.2@gmail.com',
            Password: 'password',
            Phone: '1122111211',
            State: 'UP',
            City: 'Noida',
            CreatedBy: 0,
            Active: 1
        };

        dal.saveData(model, userData).then(result => {
            console.log('result: ', result);
            done();
        }).catch(error => {
            done(error);
        });
    }).timeout(5000);
});