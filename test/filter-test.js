const
    Mocha = require("mocha"),
    Chai = require("chai"),
    Filter = require("../dist/db/controller/filter");

Chai.should();

describe("Filter", () => {
    describe("convertFilterToMongoDB", () => {
        it("should successfully convert a number filter", () => {
            Filter.convertFilterToMongoDB({num: {gt: 1, gte: 2, lt: 3, lte: 4}})
                .should.deep.eq({num: {$gt: 1, $gte: 2, $lt: 3, $lte: 4}});
        });
    });
});
