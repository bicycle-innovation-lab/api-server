import * as Mongoose from "mongoose";
import {ObjectID} from "mongodb";
import {ObjectId, prop} from "./utils";
import {ReadStream} from "fs";
import resize, {convert} from "../images/resize";
import {bufferToStream, streamToBuffer} from "../images/buffers";
import {uploadFile} from "./file";
import {model, schema} from "./schema";
import {inEnum, required} from "./modifiers";

export enum ImageVariantType {
    Original = "original",
    Small = "small",
    Large = "large"
}

export const allImageVariantTypes = Object.values(ImageVariantType);

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

interface ImageVariant {
    type: ImageVariantType;
    width: number;
    height: number;
    fileId: ObjectID;
}

export interface Image {
    fileName: string;
    title: string;
    alt: string;
    variants: ImageVariant[];
}

const imageSchema = schema<Image>({
    fileName: prop(String, [required]),
    title: prop(String, [required]),
    alt: prop(String, [required]),
    variants: [{
        type: prop(String, [required, inEnum(allImageVariantTypes)]),
        width: prop(Number, [required]),
        height: prop(Number, [required]),
        fileId: prop(ObjectId, [required])
    }]
});
export type ImageDocument = Image & Mongoose.Document;
export const ImageModel = model(
    "image",
    imageSchema,
    {
        staticMethods: {
            async createImage(name: string, title: string, alt: string, source: ReadStream, variants: ImageVariantType[]): Promise<ImageDocument> {
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

                    const img = {
                        type: variant,
                        width: size.width || original.width,
                        height: size.height || original.height,
                        fileId: uploaded
                    };
                    resizedVariants.push(img);
                }

                return new ImageModel({
                    fileName: name,
                    title,
                    alt,
                    variants: resizedVariants
                })
            }
        }
    });