import * as Joi from "joi";
import * as JoiPhoneNumber from "joi-phone-number";
import {allRoles} from "../../auth/role";

export const joi: typeof Joi = Joi.extend(JoiPhoneNumber);

export const Password = () => joi.string().max(72);
export const Email = () => joi.string().email();
export const Phone = () => joi.string().phoneNumber();
export const Role = () => joi.string().valid(allRoles);
export const ObjectId = () => joi.string().hex().length(24);
