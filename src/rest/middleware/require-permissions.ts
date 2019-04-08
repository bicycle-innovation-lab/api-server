import * as Koa from "koa";
import {AuthLevel, getRoleLevel, roleLevels} from "../../auth/role";

const RequirePermission: (level: AuthLevel) => Koa.Middleware = level => async (ctx, next) => {
    const user = await ctx.state.getUser();
    if (user) {
        const userLevel = getRoleLevel(user.role);
        if (userLevel >= level) {
            return await next();
        }
    }
    // user is not authorized, or not signed in
    ctx.throw(403, "User has insufficient permissions");
};
export default RequirePermission;
