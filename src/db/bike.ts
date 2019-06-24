import * as Mongoose from "mongoose";
import {Image} from "./image";
import {ObjectId, prop} from "./utils";
import {def, ref, required} from "./modifiers";
import {schema} from "./schema";

interface Bike {
    title: string;
    description: string;
    images: ObjectId[],
    featuredImage: number;
    price: number;
    discount?: number;
    categories: ObjectId[];
}

const bikeSchema = schema<Bike>({
    title: prop(String, [required]),
    description: prop(String, [required]),
    images: [prop(ObjectId, [ref("Image")])],
    featuredImage: prop(Number, [required, def(0)]),
    price: prop(Number, [required]),
    discount: prop(Number, [def(0)]),
    categories: [prop(ObjectId, [ref("Image")])]
});
export type BikeDocument = Bike & Mongoose.Document;
export const BikeModel = Mongoose.model<BikeDocument>("bike", bikeSchema);
