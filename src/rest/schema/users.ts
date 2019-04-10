import * as Joi from "joi";
import * as JoiPhoneNumber from "../../types/joi-phone-number";
import {allRoles, Role as Roles} from "../../auth/role";

const joi = Joi.extend(JoiPhoneNumber);

const Password = () => joi.string().max(72);
const Email = () => joi.string().email();
const Phone = () => joi.string().phoneNumber();
const Role = () => joi.string().valid(allRoles);

export const CreateUserRequestSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: Email().required(),
    phone: Phone().required(),
    password: Password().required(),
    role: Role().default(Roles.User).optional()
});
