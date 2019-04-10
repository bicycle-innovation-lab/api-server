import * as Koa from "koa";
import {AuthLevel} from "../../auth/role";
import {UserModel} from "../../db/user";

const GetUsers: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    const signedIn = await ctx.state.getUser();
    if (!signedIn) {
        return ctx.throw(404);
    }
    const isMe = id === "me";
    if (!isMe) {
        // only managers can get other users data
        if (signedIn.authLevel < AuthLevel.Manager) {
            return ctx.throw(404);
        }
    }
    const user = isMe
        ? signedIn
        : await UserModel.findOne({_id: id});
    if (!user) {
        ctx.throw(404);
    } else {
        return user.toCleanObject();
    }
};

export default GetUsers;
