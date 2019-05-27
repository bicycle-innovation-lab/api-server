import * as Koa from "koa";
import * as Busboy from "async-busboy";
import {Image, ImageVariantType} from "../../../db/image";
import {CreateImageRequestSchema} from "../../schema/images";

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

    const {title, alt} = ctx.validate(CreateImageRequestSchema, fields);

    const image = await Image.createImage(name, title, alt, file, [
        ImageVariantType.Original,
        ImageVariantType.Small,
        ImageVariantType.Large
    ]);
    if (!image) {
        return ctx.throw(500);
    }
    await image.save();

    ctx.status = 201;
    return image.toCleanObject();
};
export default PostImage;
