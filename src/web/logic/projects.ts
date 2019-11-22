import * as Koa from "koa";
import {Booking, BookingDocument} from "../../db/booking";
import {AuthLevel, getRoleLevel} from "../../auth/role";
import ValidationError from "./validation.error";
import InvalidReferenceError from "./invalid-reference.error";
import {Filter} from "../../db/controller/filter";

export async function getProject(ctx: Koa.Context, id: string): Promise<ProjectDocument | undefined> {
    let filter: Filter<Project> | string = id;

    // only managers and up can see bookings made by other users
    const signedIn = await ctx.state.getUser();
    if (getRoleLevel(signedIn.role) < AuthLevel.Manager) {
        filter = {id, user: signedIn.id};
    }

    return await ctx.state.db.projects.find(filter) || undefined;
}

export interface ListProjectsOptions {
    filter?: Filter<Project>
}

export async function listProjects(ctx: Koa.Context, opts: ListProjectsOptions = {}): Promise<ProjectDocument[]> {
    const filter: Filter<Project> = Object.assign({}, opts.filter);

    // only managers and up can see bookings made by other users
    const signedIn = await ctx.state.getUser();
    if (signedIn.authLevel < AuthLevel.Manager) {
        filter.user = signedIn.id;
    }

    return await ctx.state.db.Projects.list(filter);
}

export interface CreateProjectOptions {
    image: string;
    name: string;
    startDate: Date;
    endDate: Date;
    address: {
        streetName: string;
        streetNumber: string;
        city: string;
        areaCode: string;
        country: string;
    };
    managers: string[]
    users: string[];
    bikes: string[];
    restrictions: {
        duration:{
            minDays: number;
            maxDays: number;
        };
    }
}

export async function createProject(ctx: Koa.Context, opts: CreateProjectOptions): Promise<ProjectDocument> {
    await ctx.testPermission(AuthLevel.User);

    if (opts.startDate <= opts.endDate) {
        throw new ValidationError("End time must be after start time");
    }

    // only managers can create bookings on behalf of another user
    if (opts.startDate) {
        await ctx.testPermission(AuthLevel.Manager);

        // check if the given user exists
        const count = await ctx.state.db.users.count({id: opts.user});
        if (count <= 0) {
            throw new InvalidReferenceError(`User with id "${opts.user}" does not exist`);
        }
    } else {
        opts.user = (await ctx.state.getUser()).id;
    }

    // check if the given bike exists
    const count = await ctx.state.db.bikes.count({id: opts.bike});
    if (count <= 0) {
        throw new InvalidReferenceError(`Bike with id "${opts.bike}" does not exist`);
    }

    const Project = ctx.state.db.Projects.newDocument(opts);
    await Project.save();

    return Project;
}
