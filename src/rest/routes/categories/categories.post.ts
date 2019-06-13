import * as Koa from "koa";
import {CreateCategoryRequestSchema} from "../../schema/categories";
import * as Logic from "../../../web/logic/categories";

const PostCategories: Koa.Middleware = async ctx => {
    const form = await ctx.validateBody(CreateCategoryRequestSchema);

    const category = await Logic.createCategory(ctx, form);

    ctx.status = 201;
    return category.toCleanObject();
};
export default PostCategories;
