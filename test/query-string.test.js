const
    Mocha = require("mocha"),
    Chai = require("chai"),
    QueryString = require("../dist/web/rest/utils/query-string");

Chai.should();

describe("query-string", () => {
    describe("parseQuery", () => {
        it("should parse simple key value pairs", () => {
            QueryString.parseQuery('{first="value",second=20,bool=true}')
                .should.deep.eq({first: "value", second: 20, bool: true});
        });

        it("should parse nested objects", () => {
            QueryString.parseQuery('{first="value",second={key="inner"}}')
                .should.deep.eq({first: "value", second: {key: "inner"}});

            QueryString.parseQuery('{first="value",second={key="inner",nested={double="nested"}}}')
                .should.deep.eq({first: "value", second: {key: "inner", nested: {double: "nested"}}});
        });

        it("should parse arrays", () => {
            QueryString.parseQuery('["val1","val2"]')
                .should.deep.eq(["val1", "val2"]);
        });

        it("should escape quotes with \\", () => {
            QueryString.parseQuery('"string \\"string\\" string"')
                .should.eq('string "string" string');
        });
    });

    describe("serializeQuery", () => {
        it("should serialize simple key value pairs", () => {
            QueryString.serializeQuery({first: "value", second: 20, bool: true})
                .should.eq('{first="value",second=20,bool=true}');
        });

        it("should serialize nested objects", () => {
            QueryString.serializeQuery({first: "value", second: {key: "inner"}})
                .should.eq('{first="value",second={key="inner"}}');

            QueryString.serializeQuery({first: "value", second: {key: "inner", nested: {double: "nested"}}})
                .should.eq('{first="value",second={key="inner",nested={double="nested"}}}');
        });

        it("should serialize arrays", () => {
            QueryString.serializeQuery(["val1", "val2"])
                .should.eq('["val1","val2"]');
        });

        it("should escape quotes with \\", () => {
            QueryString.serializeQuery('string "string" string')
                .should.eq('"string \\"string\\" string"');
        });
    });
});
