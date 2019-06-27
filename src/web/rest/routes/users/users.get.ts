import * as Koa from "koa";
import * as compose from "koa-compose";
import * as Logic from "../../../logic/users";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
import * as QueryString from "../../utils/query-string";
import {BookingFilterSchema} from "../../schema/bookings";
import {UserFilterSchema} from "../../schema/users";

export const GetOneUser: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
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
        const {filter: filterQuery} = ctx.query;
        let filter;
        if (filterQuery) {
            const filterObj = QueryString.parseQuery(filterQuery);
            filter = ctx.validate(UserFilterSchema, filterObj)
        }

        const users = await Logic.listUsers(ctx, {filter});
        ctx.status = 200;
        return users;
    }]);
