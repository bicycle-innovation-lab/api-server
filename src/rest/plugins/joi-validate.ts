import * as Koa from "koa";
import * as Joi from "joi";

export default function JoiValidate(app: Koa) {
    app.context.validate = (function(this: Koa.BaseContext, schema: Joi.Schema, doc: any) {
        const {error, value} = schema.validate(doc);
        if (error) {
            this.throw(400, error.details[0].message);
        }
        return value;
    }).bind(app.context);

    app.context.validateBody = (async function(this: Koa.BaseContext, schema: Joi.Schema) {
        const body = await this.request.json();
        return this.validate(schema, body);
    }).bind(app.context);
}
