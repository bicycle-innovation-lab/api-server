import * as Koa from "koa";

const NotFound: Koa.Middleware = ctx => {
    ctx.throw(404);
};
export default NotFound;
