import {Document, HookSyncCallback, model as mongooseModel, Model, Schema} from "mongoose";
import {convertFilterToMongoDB, Filter, ObjectFilter} from "./filter";

type StaticMethod<T, R, STATICS> = (this: Controller<T> & STATICS, ...params: any) => R;

type Operations = 'validate' | 'save';

export interface StaticMethods<T> {
    [key: string]: StaticMethod<T, any, this>
}

interface ControllerOptions<T, STATICS extends StaticMethods<T>> {
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

export interface SlimDocument {
    id?: string;
}

export interface Controller<T> {
    readonly model: Model<T & Document>;

    list(filter?: ObjectFilter<T & SlimDocument>): Promise<(T & Document)[]>;

    count(filter?: ObjectFilter<T & SlimDocument>): Promise<number>;

    find(filter: string | ObjectFilter<T & SlimDocument>): Promise<T & Document | nil>;

    newDocument(doc: { [key in keyof T]?: T[key] }): T & Document;
}

export default function Controller<T, STATICS extends StaticMethods<T>>(name: string,
                                                                        schema: Schema<T>,
                                                                        opts: ControllerOptions<T, STATICS> = {}): Controller<T> & STATICS {
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

    const self: Controller<T> = {
        model,
        list(filter = {}) {
            return model.find(convertFilterToMongoDB(filter)).exec();
        },
        count(filter = {}) {
            return model.count(convertFilterToMongoDB(filter)).exec();
        },
        find(filter) {
            if (typeof filter === "string")
                return model.findById(filter).exec();
            else return model.findOne(convertFilterToMongoDB(filter)).exec();
        },
        newDocument(doc) {
            return new model(doc);
        },
        ...(opts.staticMethods || {})
    };
    return Object.assign({}, opts.staticMethods, self);
}