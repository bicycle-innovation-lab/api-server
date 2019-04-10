import * as Router from "koa-router";
import * as Mongoose from "mongoose";
import * as compose from "koa-compose";
import RequirePermission from "../middleware/require-permissions";
import {AuthLevel, getRoleLevel} from "../../auth/role";
import {User, UserModel} from "../../db/user";
import {CreateUserRequestSchema} from "../schema/users";

const UsersRouter = new Router();

UsersRouter.post("/", async ctx => {
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
});

UsersRouter.get("/me", compose([
    RequirePermission(AuthLevel.User),
    async (ctx: { state: any }) => {
        const user: User & Mongoose.Document = await ctx.state.getUser();
        return user.toCleanObject();
    }
]));

export default UsersRouter;
