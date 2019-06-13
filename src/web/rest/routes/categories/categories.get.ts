import * as Koa from "koa";
import * as Logic from "../../../logic/categories";

export const GetMultipleCategories: Koa.Middleware = async ctx => {
    const categories = await Logic.listCategories(ctx);
    ctx.status = 200;
    return categories.map(it => it.toCleanObject());
};
export const GetOneCategory: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    const cat = await Logic.getCategory(ctx, id);
    if (!cat) {
        return ctx.throw(404);
    }

    ctx.status = 200;
    return cat;
};
