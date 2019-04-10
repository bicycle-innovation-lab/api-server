import * as Koa from "koa";
import {AuthLevel, getRoleLevel} from "../../auth/role";

export default function TestPermission(app: Koa) {
    app.context.testPermission = (async function(this: Koa.BaseContext, level: AuthLevel) {
        const user = await this.state.getUser();
        if (user) {
            const userLevel = getRoleLevel(user.role);
            if (userLevel >= level) {
                return true
            } else {
                // user does not have high enough auth level
                this.throw(403, "User has insufficient permissions");
            }
        } else {
            // no user is signed in
            this.set("WWW-Authenticate", "Bearer");
            this.throw(401, "No session authentication");
        }
    });
}