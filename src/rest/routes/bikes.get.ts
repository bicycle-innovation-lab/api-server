import * as Koa from "koa";
import {BikeModel} from "../../db/bike";

export const GetMultipleBikes: Koa.Middleware = async () => {
    return (await BikeModel.find()).map(it => it.toCleanObject());
};
