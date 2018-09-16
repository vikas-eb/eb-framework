const chai = require('chai');
const fileHelper = require('../util/file.helper');
const path = require('path');

describe("file helper tests", () => {
    chai.should();

    it("file doesn't exist test", (done) => {
        fileHelper.checkFileExists('').then(exists => {
            exists.should.equal(false);
            done();
        }).catch(err => done(err));
    });

    it("file exists test", (done) => {

        fileHelper.checkFileExists(path.resolve('../app.js')).then(exists => {
            exists.should.equal(true);
        }).catch(err => done(err));
    });
});
