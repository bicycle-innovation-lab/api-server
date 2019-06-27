import * as Koa from "koa";
import * as Logic from "../../../logic/categories";
import * as BikeLogic from "../../../logic/bikes";

export const GetMultipleCategories: Koa.Middleware = async ctx => {
    const categories = await Logic.listCategories(ctx);
    ctx.status = 200;
    return categories;
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
export const GetCategoryBikes: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    const cat = await Logic.getCategory(ctx, id);
    if (!cat) {
        return ctx.throw(404);
    }

    const bikes = await BikeLogic.listBikes(ctx, {categories: cat.id});
    ctx.status = 200;
    return bikes;
};
