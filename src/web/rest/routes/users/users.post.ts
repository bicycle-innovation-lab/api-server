import * as Koa from "koa";
import {CreateUserRequestSchema} from "../../schema/users";
import * as Logic from "../../../logic/users";

const PostUsers: Koa.Middleware = async ctx => {
    const opts = await ctx.validateBody(CreateUserRequestSchema);
    const user = await Logic.createUser(ctx, opts);
    ctx.status = 201;
    return user;
};

export default PostUsers