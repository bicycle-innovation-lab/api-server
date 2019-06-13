import * as Koa from "koa";
import {ObjectId} from "../../../schema/common";
import {downloadFile} from "../../../../db/file";
import * as Logic from "../../../logic/images";

export const GetImage: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    if (ObjectId().validate(id).error) {
        ctx.throw(404);
    }

    const image = await Logic.getImage(ctx, id);

    if (!image) {
        ctx.throw(404);
    } else {
        ctx.status = 200;
        return image.toCleanObject();
    }
};

export const GetImageVariant: Koa.Middleware = async ctx => {
    const {id, variant} = ctx.params;
    if (ObjectId().validate(id).error) {
        ctx.throw(404);
    }

    const image = await Logic.getImage(ctx, id);
    if (!image) {
        return ctx.throw(404);
    }

    const imageVariant = image.variants.find(it => it.type === variant);
    if (!imageVariant) {
        return ctx.throw(404);
    }
    ctx.body = downloadFile(imageVariant.fileId);
    ctx.skipMessageFormatting = true;
    ctx.status = 200;
    ctx.type = "image/png";
    return;
};
