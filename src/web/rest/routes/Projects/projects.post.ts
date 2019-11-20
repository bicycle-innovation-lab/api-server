import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
//Change to Project import
import * as Logic from "../../../logic/bookings";
import {CreateBookingRequestSchema} from "../../schema/bookings";


const PostProjects: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const form = await ctx.validateBody(CreateBookingRequestSchema);

        const project = await Logic.createBooking(ctx, form);

        ctx.status = 201;
        return project;
    }
]);
export default PostProjects;
