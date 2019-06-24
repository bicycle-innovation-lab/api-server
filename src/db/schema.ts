import {
    Document,
    HookSyncCallback,
    model as mongooseModel,
    Model,
    Schema,
    SchemaOptions,
    SchemaType,
    SchemaTypeOpts
} from "mongoose";

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

type StaticMethod<T, R> = (this: Model<T & Document>, ...params: any) => R;

interface StaticMethods<T> {
    [key: string]: StaticMethod<T, any>
}

interface ModelOptions<T, STATICS extends StaticMethods<T>> {
    statics: STATICS;
    pre?: {
        [key in 'validate' | 'save']?: HookSyncCallback<T & Document>;
    }
}

export function model<T, STATICS extends StaticMethods<T>>(name: string,
                                                           schema: Schema<T>,
                                                           opts: ModelOptions<T, STATICS>): Model<T & Document> & STATICS {
    if (opts.statics) {
        schema.static(opts.statics);
    }
    const model = mongooseModel<T & Document>(name, schema);
    return model as Model<T & Document> & STATICS;
}
