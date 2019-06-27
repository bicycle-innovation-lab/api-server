import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
import * as Logic from "../../../logic/bookings";
import {BookingFilterSchema} from "../../schema/bookings";

export const GetOneBooking: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {id} = ctx.params;

        const booking = await Logic.getBooking(ctx, id);
        if (!booking) {
            return ctx.throw(404);
        }

        ctx.status = 200;
        return booking;
    }]
);

export const GetMultipleBookings: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const filter = ctx.query.filter
            ? ctx.validateQuery(BookingFilterSchema, ctx.query.filter)
            : undefined;

        const bookings = await Logic.listBookings(ctx, {filter});

        ctx.status = 200;
        return bookings.map(it => it);
    }
]);
