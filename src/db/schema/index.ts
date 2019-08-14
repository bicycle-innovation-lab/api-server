import {
    Document,
    HookSyncCallback,
    model as mongooseModel,
    Model,
    Schema, SchemaDefinition,
    SchemaOptions,
    SchemaType,
    SchemaTypeOpts
} from "mongoose";
import {cleanDocument} from "./utils";

export function schema<T extends { [key: string]: any }>(
    definition: { [key in keyof T]?: SchemaTypeOpts<any> | Schema | SchemaType },
    options: SchemaOptions = {}
): Schema<T> {
    if (!options.toJSON) {
        options.toJSON = {
            versionKey: false,
            transform(doc, ret) {
                return cleanDocument(ret);
            }
        }
    }
    return new Schema(definition as SchemaDefinition, options);
}
