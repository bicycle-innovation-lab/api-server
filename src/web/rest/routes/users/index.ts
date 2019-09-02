import * as Koa from "koa";
import * as Router from "koa-router";
import PostUsers from "./users.post";
import {GetOneUser, GetMultipleUsers} from "./users.get";
import PatchUser from "./users.patch";
import {AuthLevel} from "../../../../auth/role";

export async function canSeeUser(id: string, ctx: Koa.BaseContext): Promise<boolean> {

    const signedIn = await ctx.state.getUser();
    if (!signedIn) {
        return false;
    }
    if (id !== "me") {
        if (signedIn.authLevel < AuthLevel.Manager) {
            return false;
        }
    }
    return true;
}

const UsersRouter = new Router();

UsersRouter.post("/", PostUsers);
UsersRouter.get("/", GetMultipleUsers);
UsersRouter.get("/:id", GetOneUser);
UsersRouter.patch("/:id", PatchUser);

export default UsersRouter;
