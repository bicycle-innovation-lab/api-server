import * as Koa from "koa";
import {AuthLevel, getRoleLevel} from "../../auth/role";
import InsufficientPermissionError from "../logic/insufficient-permission.error";
import InvalidTokenError from "../logic/invalid-token.error";

export default function TestPermission(app: Koa) {
    app.context.testPermission = (async function(this: Koa.BaseContext, level: AuthLevel) {
        const user = await this.state.getUser();
        if (user) {
            const userLevel = user.authLevel;
            if (userLevel >= level) {
                return true
            } else {
                // user does not have high enough auth level
                throw new InsufficientPermissionError(level, userLevel);
            }
        } else {
            // no user is signed in
            throw new InvalidTokenError("No session authentication");
        }
    });
}