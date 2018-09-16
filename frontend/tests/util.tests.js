const util =  require("../src/util/util");

describe("util test", () => {
    it("the header test", done => {
        const headers = util.getMandatoryRequestHeaders();
        console.log(headers);

        done();
    });
});