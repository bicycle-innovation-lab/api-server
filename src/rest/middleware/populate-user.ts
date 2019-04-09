import * as Koa from "koa";
import {User, UserModel} from "../../db/user";

const PopulateUser: Koa.Middleware = async (ctx, next) => {
    /** Returns the currently signed in user, or undefined. */
    ctx.state.getUser = async () => {
        // fetch user data if the user is signed in, and the user data has not yet been fetched from the db
        if (!ctx.state.user && ctx.state.userToken) {
            ctx.state.user = await UserModel.findById(ctx.state.userToken.sub);
        }
        return ctx.state.user as User | undefined;
    };
    return await next();
};
export default PopulateUser;
