import * as Koa from "koa";
import * as compose from "koa-compose";
import * as Logic from "../../../logic/users";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
import {UserFilterSchema} from "../../schema/users";

export const GetOneUser: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async (ctx: Koa.Context) => {
        const {id} = ctx.params;

        const user = await Logic.getUser(ctx, id);

        if (!user) {
            return ctx.throw(404);
        } else {
            ctx.status = 200;
            return user;
        }
    }]);

export const GetMultipleUsers: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const filter = ctx.query.filter
            ? ctx.validateQuery(UserFilterSchema, ctx.query.filter)
            : undefined;

        const users = await Logic.listUsers(ctx, {filter});
        ctx.status = 200;
        return users;
    }]);
