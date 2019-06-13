import {joi, ObjectId} from "../../schema/common";

export const CreateBikeRequestSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required(),
    categories: joi.array().items(ObjectId()).default([]),
    images: joi.array().items(ObjectId()).default([])
}).required();
