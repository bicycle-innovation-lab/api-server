import * as Koa from "koa";
import {ObjectId} from "../../../schema/common";
import * as Logic from "../../../logic/bikes";
import * as BookingLogic from "../../../logic/bookings";

export const GetMultipleBikes: Koa.Middleware = async ctx => {
    const bikes = await Logic.listBikes(ctx);

    ctx.status = 200;
    return bikes.map(it => it.toCleanObject());
};

export const GetOneBike: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    if (ObjectId().validate(id).error) {
        return ctx.throw(404);
    }

    const bike = await Logic.getBike(ctx, id);
    if (!bike) {
        return ctx.throw(404);
    }

    ctx.status = 200;
    return bike.toCleanObject();
};

export const GetBikeBookings: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    if (ObjectId().validate(id).error) {
        return ctx.throw(404);
    }

    const bookings = await BookingLogic.listBookings(ctx, {filter: {bike: id}});

    // TODO: Hide user id if logged in user is not manager or higher
    ctx.status = 200;
    return bookings.map(it => it.toCleanObject());
};
