import * as Koa from "koa";
import {BikeModel} from "../../db/bike";

export const GetMultipleBikes: Koa.Middleware = async () => {
    return (await BikeModel.find()).map(it => it.toCleanObject());
};

export const GetOneBike: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    const bike = await BikeModel.findById(id);
    if (!bike) {
        ctx.throw(404);
    } else {
        return bike;
    }
};
