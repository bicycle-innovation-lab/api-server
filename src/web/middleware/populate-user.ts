import * as Koa from "koa";
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
        if (ctx.state.subject === undefined && ctx.state.authenticated) {
            const subject = await ctx.state.db.users.find(ctx.state.authToken.sub);
            if (!subject) {
                ctx.state.subject = null;
            } else {
                const issued = new Date(ctx.state.authToken.iat * 1000);
                if (issued < subject.tokensNotBefore) {
                    ctx.state.subject = null;
                } else {
                    ctx.state.subject = subject;
                }
            }
        }
        return ctx.state.subject;
    };
    return await next();
};
export default PopulateUser;
