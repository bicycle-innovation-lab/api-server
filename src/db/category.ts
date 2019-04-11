import {arrayProp, instanceMethod, prop, Typegoose} from "typegoose";
import * as Mongoose from "mongoose";
import Image from "./image";
import {cleanMongooseDocument} from "./utils";

export class Category extends Typegoose {
    @prop({required: true})
    title!: string;

    @prop({required: true})
    description!: string;

    @arrayProp({items: Image})
    image!: Image[];

    @instanceMethod
    toCleanObject(this: CategoryDocument) {
        return cleanMongooseDocument(this.toObject());
    }
}
export const CategoryModel = new Category().getModelForClass(Category);
export type CategoryDocument = Category & Mongoose.Document;
