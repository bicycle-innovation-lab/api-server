import * as Koa from "koa";
import {UpdateCategoryRequestSchema} from "../../schema/categories";
import * as Logic from "../../../web/logic/categories";

const PutCategories: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    const form = await ctx.validateBody(UpdateCategoryRequestSchema);
    form.id = id;

    const category = await Logic.updateCategory(ctx, form);
    if (!category) {
        return ctx.throw(404);
    }

    ctx.status = 200;
    return category.toCleanObject();
};
export default PutCategories;
