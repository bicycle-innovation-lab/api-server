import * as Router from "koa-router";
import * as Mongoose from "mongoose";
import * as Joi from "joi";
import * as JoiPhoneNumber from "joi-phone-number";
import RequirePermission, {testPermission} from "../middleware/require-permissions";
import {allRoles, AuthLevel, getRoleLevel} from "../../auth/role";
import {User, UserModel} from "../../db/user";
import compose = require("koa-compose");

const joi = Joi.extend(JoiPhoneNumber);

const CreateUserRequestSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.string().phoneNumber().required(),
    password: joi.string().max(72).required(),
    role: joi.string().default("user").valid(allRoles).optional()
});

const UsersRouter = new Router();

UsersRouter.post("/", async ctx => {
    const body = await ctx.request.json();

    const {error, value} = CreateUserRequestSchema.validate(body);
    if (error) {
        ctx.throw(400, error.details[0].message);
    }

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
        await testPermission(ctx, AuthLevel.Admin);
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
