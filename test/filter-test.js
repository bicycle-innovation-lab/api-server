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

        it("should convert string filter", () => {
            Filter.convertFilterToMongoDB({str: "String"})
                .should.deep.eq({str: {$eq: "String"}});
        });

        it("should convert string array filter", () => {
            Filter.convertFilterToMongoDB({str: ["String1", "String2"]})
                .should.deep.eq({str: {$in: ["String1", "String2"]}});
        });
    });
});
