import * as Koa from "koa";
import * as compose from "koa-compose";
import {CreateCategoryRequestSchema} from "../../schema/categories";
import * as Logic from "../../../web/logic/categories";
import RequirePermission from "../../middleware/require-permissions";
import {AuthLevel} from "../../../auth/role";

const PostCategories: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        const form = await ctx.validateBody(CreateCategoryRequestSchema);

        const category = await Logic.createCategory(ctx, form);

        ctx.status = 201;
        return category.toCleanObject();
    }]);
export default PostCategories;
