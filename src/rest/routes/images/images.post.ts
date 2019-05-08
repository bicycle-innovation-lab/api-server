import * as Koa from "koa";
import * as Busboy from "async-busboy";
import {Image, ImageVariantType} from "../../../db/image";

const PostImage: Koa.Middleware = async ctx => {
    const {files, fields} = await Busboy(ctx.req);
    if (!files) {
        return ctx.throw(400);
    }

    const file = files.find(it => it.fieldname === "file");
    if (!file) {
        return ctx.throw(400);
    }
    const {filename: name} = file;

    const image = await Image.createImage(name, file, [
        ImageVariantType.Original,
        ImageVariantType.Small,
        ImageVariantType.Large
    ]);
    if (!image) {
        return ctx.throw(500);
    }
    await image.save();

    ctx.status = 200;
    return image.toCleanObject();
};
export default PostImage;
