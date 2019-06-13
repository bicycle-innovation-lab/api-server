import * as Koa from "koa";
import {UserDocument, UserModel} from "../../db/user";
import {AuthLevel, getRoleLevel, Role} from "../../auth/role";
import {ObjectId} from "../../rest/schema/common";

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
        return undefined;
    }
    if (id !== "me" && ObjectId().validate(id).error) {
        return undefined;
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

export interface UserCreationOptions {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    avatar?: string;
}

export class EmailCollisionError extends Error {
    expose = true;
    status = 422;

    constructor(email: string) {
        super(`User with email "${email}" already exists`);
    }
}

export async function createUser(ctx: Koa.Context, opts: UserCreationOptions): Promise<UserDocument> {
    // only admins can assign a role to a new user
    if (getRoleLevel(opts.role) > AuthLevel.User) {
        await ctx.testPermission(AuthLevel.Admin);
    }

    const user = new UserModel(opts);
    await user.setPassword(opts.password);

    try {
        await user.save();
    } catch(err) {
        if (err.code == 11000) {
            throw new EmailCollisionError(opts.email);
        } else {
            throw err;
        }
    }

    return user;
}
