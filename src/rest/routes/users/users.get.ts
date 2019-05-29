import * as Koa from "koa";
import * as compose from "koa-compose";
import {UserModel} from "../../../db/user";
import {canSeeUser} from "./index";
import RequirePermission from "../../middleware/require-permissions";
import {AuthLevel} from "../../../auth/role";

export const GetOneUser: Koa.Middleware = async ctx => {
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

export const GetMultipleUsers: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        ctx.status = 200;
        return (await UserModel.find()).map(it => it.toCleanObject());
    }
]);
