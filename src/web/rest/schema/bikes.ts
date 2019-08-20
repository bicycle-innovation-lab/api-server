import {joi, numberFilter, ObjectId, singleOrArray} from "../../schema/common";

export const CreateBikeRequestSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required(),
    categories: joi.array().items(ObjectId()).default([]),
    images: joi.array().items(ObjectId()).default([]),
    featuredImage: joi.number().min(0).optional().default(0)
})
    .rename("featured_image", "featuredImage")
    .required();

export const BikeFilterSchema = joi.object({
    id: singleOrArray(() => joi.string()),
    price: numberFilter(),
    categories: singleOrArray(ObjectId)
});

export const PatchBikeRequestSchema = joi.object({
    title: joi.string(),
    description: joi.string(),
    price: joi.number(),
    categories: joi.array().items(ObjectId()),
    images: joi.array().items(ObjectId()),
    featuredImage: joi.number().min(0)
})
    .rename("featured_image", "featuredImage");
