import {arrayProp, prop, Typegoose} from "typegoose";
import Image from "./image";

export class Category extends Typegoose {
    @prop({required: true})
    title!: string;

    @prop({required: true})
    description!: string;

    @arrayProp({items: Image})
    image!: Image[];
}
export const CategoryModel = new Category().getModelForClass(Category);
