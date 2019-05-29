import * as Koa from "koa";
import {UserModel} from "../../../db/user";
import {canSeeUser} from "./index";

const GetOneUser: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    if (!await canSeeUser(id, ctx)) {
        ctx.throw(404);
    }
    const signedIn = await ctx.state.getUser();
    const user = id === "me"
        ? signedIn
        : await UserModel.findOne({_id: id});
    if (!user) {
        ctx.throw(404);
    } else {
        ctx.status = 200;
        return user.toCleanObject();
    }
};

export default GetOneUser;
