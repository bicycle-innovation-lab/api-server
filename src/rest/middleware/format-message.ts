import * as Koa from "koa";

const FormatMessage: Koa.Middleware = async (ctx, next) => {
    try {
        const data = await next();
        ctx.body = JSON.stringify({data, code: 200});
    } catch (err) {
        if ((err.status || 500) >= 500) {
            console.error("Internal error", err);
        }
        const res = {
            code: err.status || 500,
            error: err.expose === true ?
                err.message :
                "Unknown Error"
        };
        ctx.body = JSON.stringify(res);
    } finally {
        ctx.type = "json";
    }
};
export default FormatMessage;
