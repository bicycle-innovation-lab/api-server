import * as Koa from "koa";
import {User, UserDocument, UserModel} from "../../db/user";
import {AuthLevel, getRoleLevel} from "../../auth/role";

export async function canSeeUser(id: string, ctx: Koa.Context): Promise<boolean> {
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

export async function getUser(ctx: Koa.Context, id: string): Promise<UserDocument | undefined> {
    if (!await canSeeUser(id, ctx)) {
        return ctx.throw(404);
    }

    return id === "me"
        ? await ctx.state.getUser()
        : await UserModel.findOne({_id: id});
}

export async function listUsers(ctx: Koa.Context): Promise<UserDocument[]> {
    const user = await ctx.state.getUser();
    if (!user) {
        return [];
    }
    if (getRoleLevel(user.role) < AuthLevel.Manager) {
        return [user];
    } else {
        return await UserModel.find();
    }
}
