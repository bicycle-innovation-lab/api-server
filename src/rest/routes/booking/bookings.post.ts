import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../middleware/require-permissions";
import {AuthLevel} from "../../../auth/role";
import {CreateBookingRequestSchema} from "../../schema/bookings";
import {BookingModel} from "../../../db/booking";
import {BikeModel} from "../../../db/bike";
import {UserModel} from "../../../db/user";

const PostBookings: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {startTime, endTime, bike, user} = await ctx.validateBody(CreateBookingRequestSchema);

        // only managers can create bookings on behalf of another user
        if (user) {
            await ctx.testPermission(AuthLevel.Manager);

            // check if the given user exists
            const count = await UserModel.count({id: user}).exec();
            if (count <= 0) {
                ctx.throw(422, `User with id "${user}" does not exist`);
            }
        }

        // check if the given bike exists
        const count = await BikeModel.count({id: bike}).exec();
        if (count <= 0) {
            ctx.throw(422, `Bike with id "${bike}" does not exist`);
        }

        const booking = new BookingModel({startTime, endTime, bike, user});
        await booking.save();

        ctx.status = 201;
        return booking.toCleanObject();
    }
]);
export default PostBookings;
