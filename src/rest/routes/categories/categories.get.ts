import * as Koa from "koa";
import {Category, CategoryModel} from "../../../db/category";

export const GetMultipleCategories: Koa.Middleware = async () => {
    return (await CategoryModel.find()).map(it => it.toCleanObject());
};
export const GetOneCategory: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    const cat = await Category.findBySlugOrId(id);
    if (!cat) {
        ctx.throw(404);
    } else {
        ctx.status = 200;
        return cat;
    }
};
