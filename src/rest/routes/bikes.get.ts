import * as Koa from "koa";
import {BikeModel} from "../../db/bike";
import {ObjectId} from "../schema/common";

export const GetMultipleBikes: Koa.Middleware = async () => {
    return (await BikeModel.find()).map(it => it.toCleanObject());
};

export const GetOneBike: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    if (ObjectId().validate(id).error) {
        ctx.throw(404);
    }
    const bike = await BikeModel.findById(id);
    if (!bike) {
        ctx.throw(404);
    } else {
        return bike;
    }
};
