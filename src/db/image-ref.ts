import {prop, Ref, Typegoose} from "typegoose";
import {Image} from "./image";

export default class ImageRef extends Typegoose {
    @prop({required: true})
    title!: string;

    @prop({required: true})
    alt!: string;

    @prop({required: true, ref: Image})
    image!: Ref<Image>
}
