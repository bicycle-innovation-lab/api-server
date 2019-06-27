import * as Koa from "koa";
import * as Joi from "joi";
import * as QueryString from "../rest/utils/query-string";

export default function JoiValidate(app: Koa) {
    app.context.validate = (function (this: Koa.BaseContext, schema: Joi.Schema, doc: any) {
        const {error, value} = schema.validate(doc);
        if (error) {
            this.throw(400, error.message);
        }
        return value;
    });

    app.context.validateBody = (async function (this: Koa.BaseContext, schema: Joi.Schema) {
        const body = await this.request.json();
        return this.validate(schema, body);
    });

    app.context.validateQuery = (function (this: Koa.BaseContext, schema: Joi.Schema, query: string) {
        let obj;
        try {
            obj = QueryString.parseQuery(query);
        } catch (e) {
            return this.throw(400, e.message);
        }
        return this.validate(schema, obj);
    });
}
