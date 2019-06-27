import * as Koa from "koa";
import {CategoryController, CategoryDocument} from "../../db/category";
import {AuthLevel} from "../../auth/role";

export async function getCategory(ctx: Koa.Context, id: string): Promise<CategoryDocument | undefined> {
    return await CategoryController.findBySlugOrId(id) || undefined;
}

export async function listCategories(ctx: Koa.Context): Promise<CategoryDocument[]> {
    return CategoryController.list();
}

export interface CreateCategoryOptions {
    title: string;
    description: string;
}

export class SlugCollisionError extends Error {
    expose = true;
    status = 422;

    constructor(title: string) {
        super(`Category with title "${title}" already exists`);
    }
}

export async function createCategory(ctx: Koa.Context, opts: CreateCategoryOptions): Promise<CategoryDocument> {
    await ctx.testPermission(AuthLevel.Manager);

    const category = CategoryController.newDocument(opts);
    try {
        await category.save();
    } catch (err) {
        if (err.code == 11000) {
            throw new SlugCollisionError(opts.title);
        } else {
            throw err;
        }
    }

    return category;
}

export interface UpdateCategoryOptions {
    id: string;
    title?: string;
    description?: string;
}

export async function updateCategory(ctx: Koa.Context, opts: UpdateCategoryOptions): Promise<CategoryDocument | undefined> {
    await ctx.testPermission(AuthLevel.Manager);

    const category = await CategoryController.findBySlugOrId(opts.id);
    if (!category) {
        return undefined;
    }

    category.title = opts.title || category.title;
    category.description = opts.description || category.description;

    await category.save();

    return category;
}
