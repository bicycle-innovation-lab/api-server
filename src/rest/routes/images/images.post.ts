import * as Koa from "koa";
import * as compose from "koa-compose";
import * as Busboy from "async-busboy";
import {ImageVariantType} from "../../../db/image";
import {CreateImageRequestSchema} from "../../schema/images";
import * as Logic from "../../../web/logic/images";
import RequirePermission from "../../middleware/require-permissions";
import {AuthLevel} from "../../../auth/role";

const PostImage: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        const {files, fields} = await Busboy(ctx.req);
        if (!files) {
            return ctx.throw(400);
        }

        const file = files.find(it => it.fieldname === "file");
        if (!file) {
            return ctx.throw(400);
        }
        const {filename} = file;

        const {title, alt} = ctx.validate(CreateImageRequestSchema, fields);

        const image = await Logic.uploadImage(ctx, {
            filename,
            title, alt,
            variants: [
                ImageVariantType.Original,
                ImageVariantType.Small,
                ImageVariantType.Large
            ],
            file
        });

        ctx.status = 201;
        return image.toCleanObject();
    }]);
export default PostImage;
