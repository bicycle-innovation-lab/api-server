import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../middleware/require-permissions";
import {AuthLevel, getRoleLevel} from "../../../auth/role";
import {BookingModel} from "../../../db/booking";

export const GetOneBooking: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {id} = ctx.params;

        const filter: { [key: string]: any } = {_id: id};

        // only managers and up can see bookings made by other users
        const signedIn = await ctx.state.getUser();
        if (getRoleLevel(signedIn.role) < AuthLevel.Manager) {
            filter["user"] = signedIn._id;
        }

        const booking = await BookingModel.findOne(filter);
        if (!booking) {
            return ctx.throw(404);
        }

        ctx.status = 200;
        return booking.toCleanObject();
    }]
);

export const GetMultipleBookings: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const filter: { [key: string]: any } = {};

        // only managers and up can see bookings made by other users
        const signedIn = await ctx.state.getUser();
        if (getRoleLevel(signedIn.role) < AuthLevel.Manager) {
            filter["user"] = signedIn._id;
        }

        const bookings = await BookingModel.find(filter);
        ctx.status = 200;
        return bookings.map(it => it.toCleanObject());
    }
]);
