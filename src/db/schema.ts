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

export function schema<T extends { [key: string]: any }>(
    definition: { [key in keyof T]?: SchemaTypeOpts<any> | Schema | SchemaType },
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
    return new Schema(definition as SchemaDefinition, options);
}

type StaticMethod<T, R> = (this: Model<T & Document>, ...params: any) => R;
type InstanceMethod<T, R> = (this: T & Document, ...params: any) => R;

type Operations = 'validate' | 'save';

interface StaticMethods<T> {
    [key: string]: StaticMethod<T, any>
}

interface ModelOptions<T, STATICS extends StaticMethods<T>> {
    staticMethods?: STATICS;
    instanceMethods?: {
        [key in keyof T]?: T[key];
    };
    virtuals?: {
        [key in keyof T]?: T[key];
    };
    pre?: {
        [key in Operations]?: HookSyncCallback<T & Document>;
    }
}

export function model<T, STATICS extends StaticMethods<T>>(name: string,
                                                           schema: Schema<T>,
                                                           opts: ModelOptions<T, STATICS> = {}): Model<T & Document> & STATICS {
    if (opts.staticMethods) {
        schema.static(opts.staticMethods);
    }
    if (opts.instanceMethods) {
        schema.method(opts.instanceMethods as any);
    }
    if (opts.virtuals) {
        const descriptors = Object.getOwnPropertyDescriptors(opts.virtuals);
        for (let name of Object.getOwnPropertyNames(opts.virtuals)) {
            const descriptor = descriptors[name];
            let v = schema.virtual(name);
            if (descriptor.get) {
                v = v.get(descriptor.get);
            }
            if (descriptor.set) {
                v = v.set(descriptor.set);
            }
        }
    }
    if (opts.pre) {
        for (let op in opts.pre) {
            schema.pre(op, opts.pre[op as Operations]!);
        }
    }
    const model = mongooseModel<T & Document>(name, schema);
    return model as Model<T & Document> & STATICS;
}
