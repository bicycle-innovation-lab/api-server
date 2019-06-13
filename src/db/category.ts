import {arrayProp, instanceMethod, pre, prop, Ref, staticMethod, Typegoose} from "typegoose";
import * as slug from "slug";
import * as Mongoose from "mongoose";
import {cleanMongooseDocument} from "./utils";
import {ObjectId} from "../web/schema/common";
import {Image} from "./image";

@pre("validate", function (this: Category, next) {
    // noinspection JSPotentiallyInvalidUsageOfClassThis
    this.slug = slug(this.title, {lower: true});
    return next();
})
export class Category extends Typegoose {
    @prop({required: true})
    title!: string;

    /** URL friendly version of 'title'. Will automatically be updated when title updates. */
    @prop({required: true, unique: true})
    slug!: string;

    @prop({required: true})
    description!: string;

    @arrayProp({itemsRef: Image})
    image!: Ref<Image>[];

    @instanceMethod
    toCleanObject(this: CategoryDocument) {
        return cleanMongooseDocument(this.toObject());
    }

    @staticMethod
    static findBySlugOrId(id: string): Promise<CategoryDocument | null> {
        if (ObjectId().validate(id).error) {
            return CategoryModel.findOne({slug: id}).exec();
        } else {
            return CategoryModel.findById(id).exec();
        }
    }
}

export const CategoryModel = new Category().getModelForClass(Category);
export type CategoryDocument = Category & Mongoose.Document;
