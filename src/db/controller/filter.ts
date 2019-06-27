export type ObjectFilter<T> = { [key in keyof T]?: Filter<T[key]> };

type SingleOrArray<T> = T | T[];

export interface NumberFilter {
    lte?: number;
    lt?: number;
    gte?: number;
    gt?: number;
}

export interface DateFilter {
    lte?: Date;
    lt?: Date;
    gte?: Date;
    gt?: Date;
}

export type StringFilter = SingleOrArray<string>;

export type Filter<T> =
    T extends number ? NumberFilter :
        T extends string ? StringFilter :
            T extends Date ? DateFilter :
                T extends object ? ObjectFilter<T> : undefined;

export function convertFilterToMongoDB(filter: ObjectFilter<any>) {
    const rename = <T>(from: keyof T, to: string, {[from]: old, ...others}: any) => old ? ({[to]: old, ...others}) : others;

    function convert(key: string, filter?: Filter<any>) {
        if (key === "id") {
            return {_id: filter};
        }
        if (!filter) {
            return {};
        }
        if (Array.isArray(filter)) {
            return {[key]: {$in: filter}};
        }
        switch (typeof filter) {
            case "string":
                return {[key]: {$eq: filter}};
            case "object": {
                return {
                    [key]: [["gt", "$gt"], ["gte", "$gte"], ["lt", "$lt"], ["lte", "$lte"]]
                        .reduce((acc, it) => rename(it[0], it[1], acc), filter)
                };
            }
        }
    }

    return Object
        .keys(filter)
        .reduce((acc, it) => Object.assign(acc, convert(it, filter[it])), {});
}
