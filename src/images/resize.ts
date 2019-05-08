import * as Sharp from "sharp";
import {ImageVariantType, sizeForType} from "../db/image";

export default function resize(variant: ImageVariantType, originalWidth: number, originalHeight: number, input: Buffer): Promise<Buffer> {
    const size = sizeForType(variant) || {width: originalWidth, height: originalHeight};
    const width = size.width || originalWidth;
    const height = size.height || originalHeight;
    return Sharp(input)
        .resize(width, height)
        .toBuffer()
}

export function convert(input: Buffer): Promise<{ width: number, height: number, buffer: Buffer }> {
    return Sharp(input)
        .toBuffer({resolveWithObject: true})
        .then(({data, info}) => ({
            width: info.width,
            height: info.height,
            buffer: data
        }))
}
