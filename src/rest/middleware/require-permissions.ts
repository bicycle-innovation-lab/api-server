import * as Koa from "koa";
import {AuthLevel, getRoleLevel} from "../../auth/role";

const RequirePermission: (level: AuthLevel) => Koa.Middleware = level => async (ctx, next) => {
    const user = await ctx.state.getUser();
    if (user) {
        const userLevel = getRoleLevel(user.role);
        if (userLevel >= level) {
            return await next();
        } else {
            // user does not have high enough auth level
            ctx.throw(403, "User has insufficient permissions");
        }
    } else {
        // no user is signed in
        ctx.set("WWW-Authenticate", "Bearer");
        ctx.throw(401, "Not authenticated");
    }
};
export default RequirePermission;
