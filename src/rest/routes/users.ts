import * as Router from "koa-router";
import * as Mongoose from "mongoose";
import RequirePermission from "../middleware/require-permissions";
import {AuthLevel} from "../../auth/role";
import {User} from "../../db/user";
import compose = require("koa-compose");

const UsersRouter = new Router();

UsersRouter.get("/me", compose([
    RequirePermission(AuthLevel.User),
    async (ctx: {state: any}) => {
        const user: User & Mongoose.Document = await ctx.state.getUser();
        return user.toCleanObject();
    }
]));

export default UsersRouter;
