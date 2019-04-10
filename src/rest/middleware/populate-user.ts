import * as Koa from "koa";
import {User, UserModel} from "../../db/user";
import {TokenType} from "../../auth/token";

const PopulateUser: Koa.Middleware = async (ctx, next) => {
    if (ctx.state.authToken) {
        ctx.state.authType = ctx.state.authToken.type as TokenType;
    }
    ctx.state.getUser = async () => {
        // fetch user data if the user is signed in, and the user data has not yet been fetched from the db
        if (!ctx.state.user && ctx.state.authToken) {
            ctx.state.user = await UserModel.findById(ctx.state.authToken.sub);
        }
        return ctx.state.user as User | undefined;
    };
    return await next();
};
export default PopulateUser;
