import {Role as Roles} from "../../../auth/role";
import {joi, Email, Password, Phone, Role, ObjectId} from "../../schema/common";

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
    firstName: joi.string(),
    lastName: joi.string(),
    email: Email(),
    phone: Phone(),
    password: Password(),
    currentPassword: Password(),
    role: Role(),
    avatar: ObjectId(),
})
    .rename("first_name", "firstName")
    .rename("last_name", "lastName")
    .rename("current_password", "currentPassword")
    .with("password", "current_password").required();

export const ResetPasswordRequestSchema = joi.object({
    password: Password().required()
}).required();
