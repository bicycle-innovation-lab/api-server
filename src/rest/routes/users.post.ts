import * as Koa from "koa";
import {CreateUserRequestSchema} from "../schema/users";
import {AuthLevel, getRoleLevel} from "../../auth/role";
import {UserModel} from "../../db/user";

const PostUsers: Koa.Middleware = async ctx => {
    const value = await ctx.validateBody(CreateUserRequestSchema);

    const {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role
    } = value;

    // only admin can assign a role to a new user
    if (getRoleLevel(role) > AuthLevel.User) {
        await ctx.testPermission(AuthLevel.Admin);
    }

    const user = new UserModel({
        firstName,
        lastName,
        email,
        phone,
        role
    });
    await user.setPassword(password);
    try {
        await user.save();
    } catch (err) {
        // duplicate entry error: a user with the given email already exists
        if (err.code == 11000) {
            ctx.throw(422, `User with email "${email}" already exists`)
        } else {
            throw err;
        }
    }

    return user.toCleanObject();
};

export default PostUsers