import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../middleware/require-permissions";
import {AuthLevel} from "../../auth/role";
import {CreateCategoryRequestSchema} from "../schema/categories";
import {CategoryModel} from "../../db/category";

const PostCategories: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        const {title, description} = await ctx.validateBody(CreateCategoryRequestSchema);
        const category = new CategoryModel({title, description});
        await category.save();
        return category.toCleanObject();
    }
]);
export default PostCategories;
