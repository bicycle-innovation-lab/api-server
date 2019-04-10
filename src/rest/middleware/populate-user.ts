import * as Koa from "koa";
import {UserModel} from "../../db/user";
import {TokenType} from "../../auth/token";

const PopulateUser: Koa.Middleware = async (ctx, next) => {
    if (ctx.state.authToken) {
        ctx.state.authType = ctx.state.authToken.type as TokenType;
    }

    ctx.state.authenticated = !!ctx.state.authToken;
    ctx.state.session = ctx.state.authType === TokenType.Session;

    ctx.state.getUser = () => ctx.state.session
        ? ctx.state.getSubject()
        : undefined;
    ctx.state.getSubject = async () => {
        if (!ctx.state.subject && ctx.state.authenticated) {
            ctx.state.subject = UserModel.findById(ctx.state.authToken.sub);
        }
        return ctx.state.subject;
    };
    return await next();
};
export default PopulateUser;
