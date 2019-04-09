import * as Router from "koa-router";
import * as Joi from "joi";
import {UserModel} from "../../db/user";

const TokensRequestSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

const TokensRouter = new Router();

TokensRouter.post("/", async ctx => {
    const body = await ctx.request.json();

    const {error, value} = Joi.validate(body, TokensRequestSchema);
    if (error) {
        ctx.throw(400, error.details[0].message)
    }

    const {email, password} = value;
    const user = await UserModel.findOne({email});

    if (!user || !(await user.comparePassword(password))) {
        ctx.throw(400, "Wrong email or password");
    } else {
        return await user.issueToken();
    }
});

export default TokensRouter;
