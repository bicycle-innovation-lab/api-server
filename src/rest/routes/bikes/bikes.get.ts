import * as Koa from "koa";
import {ObjectId} from "../../schema/common";
import * as Logic from "../../../web/logic/bikes";

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
