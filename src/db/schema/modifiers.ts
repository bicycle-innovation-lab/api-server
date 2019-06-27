import {Schema} from "mongoose";
import {Modifier} from "./utils";

export const required: Modifier<any> = opts => ({...opts, required: true});

export const unique: Modifier<any> = opts => ({...opts, unique: true});

export const ref: (collection: string) => Modifier<typeof Schema.Types.ObjectId> =
    collection => opts => ({...opts, ref: collection});

export const def: (v: any) => Modifier<any> =
    v => opts => ({...opts, default: v});

export const inEnum: (values: string[]) => Modifier<typeof String> =
    values => opts => ({...opts, enum: values});
