import * as Koa from "koa";
import {Image, ImageDocument, ImageModel, ImageVariantType} from "../../db/image";
import {ReadStream} from "fs";
import {AuthLevel} from "../../auth/role";

export async function getImage(ctx: Koa.Context, id: string): Promise<ImageDocument | undefined> {
    return await ImageModel.findOne({_id: id}) || undefined;
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

    const image = await ImageModel.createImage(opts.filename, opts.title, opts.alt, opts.file, opts.variants);
    await image.save();

    return image;
}
