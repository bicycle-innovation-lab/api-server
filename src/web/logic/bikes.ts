import * as Koa from "koa";
import {BikeDocument, BikeModel} from "../../db/bike";
import {AuthLevel} from "../../auth/role";

export async function getBike(ctx: Koa.Context, id: string): Promise<BikeDocument | undefined> {
    return await BikeModel.findOne({_id: id}) || undefined;
}

export async function listBikes(ctx: Koa.Context): Promise<BikeDocument[]> {
    return BikeModel.find();
}

export interface CreateBikeOptions {
    title: string;
    description: string;
    price: number;
    categories: string[];
    images: string[];
    featuredImage?: number;
}

export async function createBike(ctx: Koa.Context, opts: CreateBikeOptions): Promise<BikeDocument> {
    ctx.testPermission(AuthLevel.Manager);

    const bike = new BikeModel(opts);
    await bike.save();

    return bike;
}
