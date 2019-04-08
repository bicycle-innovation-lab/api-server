import {arrayProp, prop, Ref, Typegoose} from "typegoose";
import Image from "./image";
import {Category} from "./category";

export class Bike extends Typegoose {
    @prop({required: true})
    title!: string;

    @prop({required: true})
    description!: string;

    @arrayProp({items: Image})
    images!: Image[];

    @prop({required: true})
    price!: number;

    @prop({default: 0})
    discount!: number;

    @arrayProp({required: true, itemsRef: Category})
    categories!: Ref<Category>[];
}
export const BikeModel = new Bike().getModelForClass(Bike);
