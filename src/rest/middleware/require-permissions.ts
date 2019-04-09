import * as Koa from "koa";
import {AuthLevel, getRoleLevel} from "../../auth/role";

/**
 * Only returns when the currently signed in user has sufficient permissions. Throws the appropriate error when the
 * request unauthenticated, or has insufficient permissions.
 */
export async function testPermission(context: Koa.Context, level: AuthLevel) {
    const user = await context.state.getUser();
    if (user) {
        const userLevel = getRoleLevel(user.role);
        if (userLevel >= level) {
            return true
        } else {
            // user does not have high enough auth level
            context.throw(403, "User has insufficient permissions");
        }
    } else {
        // no user is signed in
        context.set("WWW-Authenticate", "Bearer");
        context.throw(401, "Not authenticated");
    }
}

const RequirePermission: (level: AuthLevel) => Koa.Middleware = level => async (ctx, next) => {
    await testPermission(ctx, level);
    return await next();
};
export default RequirePermission;
