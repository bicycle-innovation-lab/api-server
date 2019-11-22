import * as Mongoose from "mongoose";
import {ObjectId, prop, Reference} from "./schema/utils";
import {BikeDocument} from "./bike";
import {UserDocument} from "./user";
import {ImageDocument} from "./image";
import {schema} from "./schema";
import {ref, required} from "./schema/modifiers";
import Controller, {SlimDocument} from "./controller";

export interface Project extends SlimDocument {
    image: Reference<ImageDocument>;;
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
    managers: string[];
    users: Reference<UserDocument>;
    bikes: Reference<BikeDocument>;
    restrictions: {
        duration:{
            minDays: number;
            maxDays: number;
        };
    }
}

const projectSchema = schema<Project>({
    startDate: prop(Date, [required]),
    endDate: prop(Date, [required]),
    bikes: prop(ObjectId, [required, ref("bike")]),
    users: prop(ObjectId, [required, ref("user")])
});
export type ProjectDocument = Project & Mongoose.Document;
export const ProjectController = Controller("project", projectSchema);
