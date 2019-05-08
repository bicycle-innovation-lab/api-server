import * as Koa from "koa";

const FormatMessage: Koa.Middleware = async (ctx, next) => {
    try {
        const data = await next();
        if (ctx.skipMessageFormatting) return;
        const status = ctx.status;
        if (status >= 400) {
            ctx.throw(status, data);
        }
        ctx.body = JSON.stringify({data, code: status});
        ctx.type = "json";
    } catch (err) {
        const status = err.status || 500;
        if (status >= 500) {
            ctx.app.emit("error", err, ctx);
        }
        const res = {
            code: status,
            error: err.expose === true ?
                err.message :
                "Unknown Error"
        };
        ctx.body = JSON.stringify(res);
        ctx.type = "json";
        ctx.status = res.code;
    }
};
export default FormatMessage;
