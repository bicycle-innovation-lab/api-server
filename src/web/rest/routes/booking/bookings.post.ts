import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
import {CreateBookingRequestSchema} from "../../schema/bookings";
import * as Logic from "../../../logic/bookings";

const PostBookings: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const form = await ctx.validateBody(CreateBookingRequestSchema);

        const booking = await Logic.createBooking(ctx, form);

        ctx.status = 201;
        return booking.toCleanObject();
    }
]);
export default PostBookings;
