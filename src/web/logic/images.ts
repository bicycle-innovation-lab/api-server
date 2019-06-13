import * as Koa from "koa";
import {ImageDocument, ImageModel} from "../../db/image";

export async function getImage(ctx: Koa.Context, id: string): Promise<ImageDocument | undefined> {
    return await ImageModel.findOne({_id: id}) || undefined;
}
