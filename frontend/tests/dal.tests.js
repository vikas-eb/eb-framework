const api =  require("../src/services/api.base");

describe("util test", () => {
    it("the header test", done => {
        const headers = util.getMandatoryRequestHeaders();
        console.log(headers);

        done();
    });
});