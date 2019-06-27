import * as Koa from "koa";
import {ImageDocument, ImageVariantType} from "../../db/image";
import {ReadStream} from "fs";
import {AuthLevel} from "../../auth/role";

export async function getImage(ctx: Koa.Context, id: string): Promise<ImageDocument | nil> {
    return await ctx.state.db.images.find(id);
}

export interface UploadImageOptions {
    filename: string;
    title: string;
    alt: string;
    variants: ImageVariantType[];
    file: ReadStream;
}

export async function uploadImage(ctx: Koa.Context, opts: UploadImageOptions): Promise<ImageDocument> {
    await ctx.testPermission(AuthLevel.Manager);

    const image = await ctx.state.db.images.createImage(opts.filename, opts.title, opts.alt, opts.file, opts.variants);
    await image.save();

    return image;
}
