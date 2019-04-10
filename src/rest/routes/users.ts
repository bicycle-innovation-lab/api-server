import * as Koa from "koa";
import * as Router from "koa-router";
import PostUsers from "./users.post";
import GetUsers from "./users.get";
import {AuthLevel} from "../../auth/role";

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
UsersRouter.get("/:id", GetUsers);

export default UsersRouter;
