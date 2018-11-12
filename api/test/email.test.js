const chai = require('chai');
const email = require('../util/email');

describe("email tests", () => {
    chai.should();

    it("email goes fine without attachment", done => {
        email.sendEmail('vikasbhandari2@gmail.com, letsdevindia@gmail.com', '', 'Test Subject','The body').then(result => {
            // both emails are good, so both should be delivered
            result.accepted.length.should.equal(2, 'Email not delivered to both');
            done();
        }).catch(error => done(error));
    }).timeout(5000);


    it("email goes fine with cc but without attachment and subject", done => {
        email.sendEmail('', 'vikasbhandari2@gmail.com, letsdevindia@gmail.com', 'No To and Attachments','The body').then(result => {
            result.accepted.length.should.equal(2, 'Email not delivered to both');
            done();
        }).catch(error => done(error));
    }).timeout(5000);

    
    it("email goes fine with attachments", done => {
        email.sendEmail('', 'vikasbhandari2@gmail.com, letsdevindia@gmail.com', 'The Attachment Test','The body',[{
            path: '../dbnotes.txt'
        }]).then(result => {
            result.accepted.length.should.equal(2, 'Email not delivered to both');
            done();
        }).catch(error => done(error));
    }).timeout(5000);
});
