import * as Koa from "koa";
import * as compose from "koa-compose";
import * as Logic from "../../../logic/users";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";

export const GetOneUser: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {id} = ctx.params;

        const user = await Logic.getUser(ctx, id);

        if (!user) {
            return ctx.throw(404);
        } else {
            ctx.status = 200;
            return user.toCleanObject();
        }
    }]);

export const GetMultipleUsers: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const users = await Logic.listUsers(ctx);
        ctx.status = 200;
        return users.map(it => it.toCleanObject());
    }]);
