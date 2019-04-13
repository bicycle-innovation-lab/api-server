import {Role as Roles} from "../../auth/role";
import {joi, Email, Password, Phone, Role} from "./common";

export const CreateUserRequestSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: Email().required(),
    phone: Phone().required(),
    password: Password().required(),
    role: Role().default(Roles.User).optional()
}).required();

export const UpdateUserRequestSchema = joi.object({
    first_name: joi.string(),
    last_name: joi.string(),
    email: Email(),
    phone: Phone(),
    password: Password(),
    current_password: Password(),
    role: Role(),
}).with("password", "current_password").required();

export const ResetPasswordRequestSchema = joi.object({
    password: Password().required()
}).required();
