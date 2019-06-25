import * as Koa from "koa";
import * as compose from "koa-compose";
import {UpdateCategoryRequestSchema} from "../../schema/categories";
import * as Logic from "../../../logic/categories";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";

const PutCategories: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        const {id} = ctx.params;
        const form = await ctx.validateBody(UpdateCategoryRequestSchema);
        form.id = id;

        const category = await Logic.updateCategory(ctx, form);
        if (!category) {
            return ctx.throw(404);
        }

        ctx.status = 200;
        return category;
    }]);
export default PutCategories;
