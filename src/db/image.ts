import {arrayProp, prop, Typegoose} from "typegoose";
import {ObjectID} from "mongodb";

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

    @arrayProp({required: true, items: ImageVariant})
    variants!: ImageVariant[];
}
