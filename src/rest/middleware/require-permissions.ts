import * as Koa from "koa";
import {AuthLevel} from "../../auth/role";

const RequirePermission: (level: AuthLevel) => Koa.Middleware = level => async (ctx, next) => {
    await ctx.testPermission(level);
    return await next();
};
export default RequirePermission;
