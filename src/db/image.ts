import {arrayProp, instanceMethod, prop, staticMethod, Typegoose} from "typegoose";
import * as Mongoose from "mongoose";
import {GridFSBucket, ObjectID} from "mongodb";
import {cleanMongooseDocument} from "./utils";
import {ReadStream} from "fs";
import resize, {convert} from "../images/resize";
import {bufferToStream, streamToBuffer} from "../images/buffers";
import {uploadFile} from "./file";

export enum ImageVariantType {
    Original = "original",
    Small = "small",
    Large = "large"
}

export interface ImageSize {
    width: number | null;
    height: number | null;
}

const sizes = {
    [ImageVariantType.Original]: {width: null, height: null},
    [ImageVariantType.Small]: {width: 300, height: 300},
    [ImageVariantType.Large]: {width: 500, height: 500}
};

export function sizeForType(type: ImageVariantType): ImageSize | undefined {
    return sizes[type];
}

const filenameRegex = /^(.+)(\.[^/.]+)$/;

function augmentFileName(name: string, type: ImageVariantType): string {
    const matches = filenameRegex.exec(name);
    if (!matches) return name;
    else return matches[1] + `.${type}` + matches[2];
}

export class ImageVariant extends Typegoose {
    @prop({required: true, enum: ImageVariantType})
    type!: ImageVariantType;

    @prop({required: true})
    width!: number;

    @prop({required: true})
    height!: number;

    @prop({required: true})
    fileId!: ObjectID;
}

export class Image extends Typegoose {
    @prop({required: true})
    fileName!: string;

    @prop({required: true})
    title!: string;

    @prop({required: true})
    alt!: string;

    @arrayProp({items: ImageVariant})
    variants!: ImageVariant[];

    @staticMethod
    static async createImage(name: string, title: string, alt: string, source: ReadStream, variants: ImageVariantType[]): Promise<ImageDocument> {
        // convert source image to proper format
        const buf = await streamToBuffer(source);
        const original = await convert(buf);

        // create all requested variants
        const resizedVariants: ImageVariant[] = [];
        for (const variant of variants) {
            const size = sizeForType(variant) || {width: null, height: null};

            let buffer: Buffer;
            if (variant == ImageVariantType.Original) {
                buffer = original.buffer;
            } else {
                buffer = await resize(variant, original.width, original.height, original.buffer);
            }

            const stream = bufferToStream(buffer);
            const varientName = augmentFileName(name, variant);

            const uploaded = await uploadFile(varientName, stream);
            if (!uploaded) continue;

            const img = new ImageVariant();
            img.type = variant;
            img.width = size.width || original.width;
            img.height = size.height || original.height;
            img.fileId = uploaded;
            resizedVariants.push(img);
        }

        return new ImageModel({
            fileName: name,
            title,
            alt,
            variants: resizedVariants
        })
    }

    @instanceMethod
    toCleanObject(this: ImageDocument) {
        return this.toObject({
            transform(doc, ret) {
                ret.id = new ObjectID(ret._id);
                delete ret._id;
                delete ret.__v;
            }
        });
    }
}

export const ImageModel = new Image().getModelForClass(Image);
export type ImageDocument = Image & Mongoose.Document;
