export type ObjectFilter<T> = { [key in keyof T]?: Filter<T[key]> };

export interface NumberFilter {
    lte?: number;
    lt?: number;
    gte?: number;
    gt?: number;
}

export type StringFilter = string;

export type Filter<T> =
    T extends number ? NumberFilter :
        T extends string ? StringFilter :
            T extends object ? ObjectFilter<T> : undefined;

export function convertFilterToMongoDB(filter: ObjectFilter<any>) {
    const rename = <T>(from: keyof T, to: string, {[from]: old, ...others}: any) => old ? ({[to]: old, ...others}) : others;

    function convert(filter: Filter<any>) {
        switch (typeof filter) {
            case "string":
                return {$eq: filter};
            case "object": {
                return [["gt", "$gt"], ["gte", "$gte"], ["lt", "$lt"], ["lte", "$lte"]]
                    .reduce((acc, it) => rename(it[0], it[1], acc), filter);
            }
        }
    }

    const result: { [key: string]: any } = {};
    Object.keys(filter).forEach(it => {
        result[it] = convert(filter[it]);
    });
    return result;
}
