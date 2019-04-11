import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../middleware/require-permissions";
import {AuthLevel} from "../../auth/role";
import {UpdateCategoryRequestSchema} from "../schema/categories";
import {Category} from "../../db/category";

const PutCategories: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        const {title, description} = await ctx.validateBody(UpdateCategoryRequestSchema);
        const {id} = ctx.params;

        const category = await Category.findBySlugOrId(id);
        if (!category) {
            return ctx.throw(404);
        }
        category.title = title || category.title;
        category.description = description || category.description;
        await category.save();
        return category.toCleanObject();
    }
]);
export default PutCategories;
