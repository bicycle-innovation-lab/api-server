import {Role as Roles} from "../../../auth/role";
import {joi, Email, Password, Phone, Role, ObjectId, singleOrArray} from "../../schema/common";

export const CreateUserRequestSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: Email().required(),
    phone: Phone().required(),
    password: Password().required(),
    role: Role().default(Roles.User).optional(),
    avatar: ObjectId().optional(),
})
    .rename("first_name", "firstName", {override: true, ignoreUndefined: true})
    .rename("last_name", "lastName", {override: true, ignoreUndefined: true})
    .required();

export const PatchUserRequestSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: Email(),
    phone: Phone(),
    password: Password(),
    currentPassword: Password(),
    role: Role(),
    avatar: ObjectId(),
})
    .rename("first_name", "firstName", {override: true, ignoreUndefined: true})
    .rename("last_name", "lastName", {override: true, ignoreUndefined: true})
    .with("password", "currentPassword").required();

export const ResetPasswordRequestSchema = joi.object({
    password: Password().required()
}).required();

export const UserFilterSchema = joi.object({
    id: singleOrArray(() => joi.string()),
    role: singleOrArray(Role)
});
