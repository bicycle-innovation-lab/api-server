import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
//Change to Project import
import * as Logic from "../../../logic/bookings";
import {BookingFilterSchema} from "../../schema/bookings";

export const GetOneProject: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {id} = ctx.params;

        const project = await Logic.getProject(ctx, id);
        if (!project) {
            return ctx.throw(404);
        }

        ctx.status = 200;
        return project;
    }]
);

export const GetMultipleProjects: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const filter = ctx.query.filter
            ? ctx.validateQuery(ProjectFilterSchema, ctx.query.filter)
            : undefined;

        const projects = await Logic.listProjects(ctx, {filter});

        ctx.status = 200;
        return projects.map(it => it);
    }
]);
