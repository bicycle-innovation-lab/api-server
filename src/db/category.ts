import * as Mongoose from "mongoose";
import * as slug from "slug";
import {ObjectId, prop, Reference} from "./utils";
import {ImageDocument} from "./image";
import {schema} from "./schema";
import {ref, required, unique} from "./modifiers";
import {ObjectId as ObjectIdSchema} from "../web/schema/common";

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
categorySchema.static('findBySlugOrId', function (this: Mongoose.Model<CategoryDocument>, id: string) {
    if (ObjectIdSchema().validate(id).error) {
        return this.findOne({slug: id}).exec();
    } else {
        return this.findById(id).exec();
    }
});
categorySchema.pre('validate', function (this: CategoryDocument, next) {
    this.slug = slug(this.title, {lower: true});
    return next();
});
export type CategoryDocument = Category & Mongoose.Document;
export const CategoryModel = Mongoose.model("category", categorySchema) as Mongoose.Model<CategoryDocument> & {
    findBySlugOrId(id: string): Promise<CategoryDocument | null>
};
