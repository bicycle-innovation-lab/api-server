import * as Router from "koa-router";
import {UserModel} from "../../db/user";
import {TokensRequestSchema} from "../schema/tokens";

const TokensRouter = new Router();

TokensRouter.post("/", async ctx => {
    const body = await ctx.request.json();

    const {error, value} = TokensRequestSchema.validate(body);
    if (error) {
        ctx.throw(400, error.details[0].message)
    }

    const {email, password} = value;
    const user = await UserModel.findOne({email});

    if (!user || !(await user.comparePassword(password))) {
        ctx.throw(422, "Wrong email or password");
    } else {
        return await user.issueToken();
    }
});

export default TokensRouter;
