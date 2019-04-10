import * as Router from "koa-router";
import * as compose from "koa-compose";
import RequirePermission from "../middleware/require-permissions";
import {AuthLevel, getRoleLevel} from "../../auth/role";
import {UserModel} from "../../db/user";
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

UsersRouter.get("/:id", compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {id} = ctx.params;
        if (id !== "me") {
            // only managers and up can get info about other users
            await ctx.testPermission(AuthLevel.Manager);
        }
        const user = id === "me"
            ? await ctx.state.getUser()
            : await UserModel.findOne({_id: id});
        if (!user) {
            ctx.throw(404);
        } else {
            return user.toCleanObject();
        }
    }
]));

export default UsersRouter;
