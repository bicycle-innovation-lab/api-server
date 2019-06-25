import * as Mongoose from "mongoose";
import {ImageDocument} from "./image";
import {ObjectId, prop, Reference} from "./utils";
import {def, ref, required} from "./modifiers";
import {schema} from "./schema";
import {CategoryDocument} from "./category";
import Controller from "./controller";

interface Bike {
    title: string;
    description: string;
    images: Reference<ImageDocument>[],
    featuredImage: number;
    price: number;
    discount?: number;
    categories: Reference<CategoryDocument>[];
}

const bikeSchema = schema<Bike>({
    title: prop(String, [required]),
    description: prop(String, [required]),
    images: [prop(ObjectId, [ref("image")])],
    featuredImage: prop(Number, [required, def(0)]),
    price: prop(Number, [required]),
    discount: prop(Number, [def(0)]),
    categories: [prop(ObjectId, [ref("image")])]
});
export type BikeDocument = Bike & Mongoose.Document;

export const BikeController = Controller(
    "bike",
    bikeSchema,
    {
        pre: {
            save(next) {
                if (this.featuredImage < 0 || this.featuredImage >= this.images.length) {
                    this.featuredImage = 0
                }
                return next();
            }
        }
    });
