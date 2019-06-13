import {Role as Roles} from "../../auth/role";
import {joi, Email, Password, Phone, Role, ObjectId} from "./common";

export const CreateUserRequestSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: Email().required(),
    phone: Phone().required(),
    password: Password().required(),
    role: Role().default(Roles.User).optional(),
    avatar: ObjectId().optional(),
})
    .rename("first_name", "firstName")
    .rename("last_name", "lastName")
    .required();

export const UpdateUserRequestSchema = joi.object({
    first_name: joi.string(),
    last_name: joi.string(),
    email: Email(),
    phone: Phone(),
    password: Password(),
    current_password: Password(),
    role: Role(),
    avatar: ObjectId(),
}).with("password", "current_password").required();

export const ResetPasswordRequestSchema = joi.object({
    password: Password().required()
}).required();
