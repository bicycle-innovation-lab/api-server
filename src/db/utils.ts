import {Schema, SchemaTypeOpts} from "mongoose";

export function cleanMongooseDocument(doc: any) {
    const {__v, _id, ...clean} = doc;
    clean.id = _id;
    return clean;
}

export const ObjectId = Schema.Types.ObjectId;

export type ObjectId = typeof ObjectId | string;

export type Reference<T> = ObjectId | T;

export type Modifier<T> = (opts: SchemaTypeOpts<T>) => SchemaTypeOpts<T>;

export function prop<T>(type: T, modifiers: Modifier<T>[] = []): SchemaTypeOpts<T> {
    const opts: SchemaTypeOpts<T> = {type};
    return modifiers.reduce((opts, it) => it(opts), opts);
}
