const user = require('../controllers/user');
const models = require('../models/').db;
const dal = require('../data/dal');
const chai = require('chai');

describe("user tests", () => {
    chai.should();

    it("Access Group Where Test", (done) => {

        const where = [{
            Active: 1
        }];

        dal.getList(models.AccessGroup, where).then(result => {
            console.log('\n\n\nthe sequelize log above should show only active records, and the limit should be 50 and offset 0');
            done();
        });
    }).timeout(5000);

    it("Access Group Dropdown Test", (done) => {
        const where = [{
            Active: 1
        }];

        dal.getList(models.AccessGroup, where, null, null, 10000, 0).then(result => {
            console.log('\n\n\nthe sequelize log above should show only active records, and the limit should be 10000 and offset 0');
            done();
        });
    }).timeout(5000);

    it("Sorting Test", (done) => {
        const where = [{
            Active: 1
        }];

        const order = [
            ['Name', 'asc']
        ];

        dal.getList(models.AccessGroup, where, order, null, 10000, 0).then(result => {
            console.log('\n\n\nthe sequelize log above should show only active records, and the limit should be 10000 and offset 0 and sorted by name - verify the name sorting in results below here');

            result.rows.forEach(row => {
                console.log('results: ', row.dataValues);
            });
            done();
        });
    }).timeout(5000);


    it("Relationship Test", (done) => {
        const where = [{
            Active: 1
        }];

        const include = [
            models.AccessType
        ];

        dal.getList(models.User, where, null, include, 10000, 0).then(result => {
            console.log('\n\n\n results below here should also show AccessType child record');

            result.rows.forEach(row => {
                console.log('results: ', row.dataValues);
            });
            done();
        });
    }).timeout(5000);


    



});