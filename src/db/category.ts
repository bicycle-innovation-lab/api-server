import {arrayProp, instanceMethod, pre, prop, staticMethod, Typegoose} from "typegoose";
import * as slug from "slug";
import * as Mongoose from "mongoose";
import Image from "./image";
import {cleanMongooseDocument} from "./utils";

@pre("save", function (this: Category, next) {
    // noinspection JSPotentiallyInvalidUsageOfClassThis
    this.slug = slug(this.title);
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

    @arrayProp({items: Image})
    image!: Image[];

    @instanceMethod
    toCleanObject(this: CategoryDocument) {
        return cleanMongooseDocument(this.toObject());
    }

    @staticMethod
    static findBySlugOrId(id: string): Promise<CategoryDocument | null> {
        return CategoryModel.findOne().or([
            {_id: id},
            {slug: id}
        ]).exec();
    }
}

export const CategoryModel = new Category().getModelForClass(Category);
export type CategoryDocument = Category & Mongoose.Document;
