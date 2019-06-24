import {Schema, SchemaDefinition, SchemaOptions, SchemaType, SchemaTypeOpts} from "mongoose";

export function schema<T extends { [key: string]: any }>(
    definition: { [key in keyof T]: SchemaTypeOpts<any> | Schema | SchemaType },
    options: SchemaOptions = {}
): Schema<T> {
    if (!options.toJSON) {
        options.toJSON = {
            versionKey: false,
                transform(doc, ret, opts) {
                // drop __v and rename _id to id
                const {__v, _id, ...clean} = ret;
                clean.id = _id;
                return clean;
            }
        }
    }
    return new Schema(definition, options);
}
