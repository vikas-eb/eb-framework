const util = require('../util/helper');
const logger = require('../util/logger');

describe("the logging tests", () => {
    util.initApp(); 

    it("Error Logging Test", done => {
        try {
            logger.logError('Error Test', '', new Error('the error came from no where'), true);
            done();
        }
        catch (error) {
            done(error);
        }
    });

    // No need for normal logging coz error logging already does that.
});