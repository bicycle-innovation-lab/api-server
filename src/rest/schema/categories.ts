import {joi} from "./common";

export const CreateCategoryRequestSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required()
}).required();

export const UpdateCategoryRequestSchema = joi.object({
    title: joi.string(),
    description: joi.string()
}).required();
