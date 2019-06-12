import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../middleware/require-permissions";
import {AuthLevel} from "../../../auth/role";
import {CreateBookingRequestSchema} from "../../schema/bookings";
import {BookingModel} from "../../../db/booking";

const PostBookings: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {startTime, endTime, bike, user} = await ctx.validateBody(CreateBookingRequestSchema);
        const booking = new BookingModel({startTime, endTime, bike, user});

        // if !bike
        // status = 422 + error besked = 


        // if user exists then...
        ctx.testPermission
        await booking.save();
        ctx.status = 201;
        return booking;
    }
]);
export default PostBookings;
