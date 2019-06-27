import * as Router from "koa-router";
import {ResetPasswordTokenRequestSchema, SessionTokenRequestSchema} from "../schema/tokens";
import {issuePasswordResetToken} from "../../../auth/token";

const TokensRouter = new Router();

TokensRouter.post("/session", async ctx => {
    const {email, password} = await ctx.validateBody(SessionTokenRequestSchema);
    const user = await ctx.state.db.users.find({email});

    if (!user || !(await user.comparePassword(password))) {
        ctx.throw(422, "Wrong email or password");
    } else {
        ctx.status = 201;
        return await user.issueToken();
    }
});

TokensRouter.post("/password-reset", async ctx => {
    const {email} = await ctx.validateBody(ResetPasswordTokenRequestSchema);
    const user = await ctx.state.db.users.find({email});
    if (user) {
        // don't leak whether a user with the given email exists or not
        // TODO: Send token to email instead of returning in body.
        ctx.status = 201;
        return await issuePasswordResetToken(user.id);
    }
    ctx.status = 200;
    return "";
});

export default TokensRouter;
