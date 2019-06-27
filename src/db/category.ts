import * as Mongoose from "mongoose";
import * as slug from "slug";
import {ObjectId, prop, Reference} from "./utils";
import {ImageDocument} from "./image";
import {model, schema} from "./schema";
import {ref, required, unique} from "./modifiers";
import {ObjectId as ObjectIdSchema} from "../web/schema/common";
import Controller from "./controller";

export interface Category {
    title: string;
    slug: string;
    description: string;
    image: Reference<ImageDocument>[];
}

const categorySchema = schema<Category>({
    title: prop(String, [required]),
    slug: prop(String, [required, unique]),
    description: prop(String, [required]),
    image: [prop(ObjectId, [ref("image")])]
});
export type CategoryDocument = Category & Mongoose.Document;

export const CategoryController = Controller(
    "categories",
    categorySchema,
    {
        pre: {
            validate(next) {
                this.slug = slug(this.title, {lower: true});
                return next();
            }
        },
        staticMethods: {
            findBySlugOrId(id: string): Promise<CategoryDocument | nil> {
                if (ObjectIdSchema().validate(id).error) {
                    return this.find({slug: id});
                } else {
                    return this.find(id);
                }
            }
        }
    });
