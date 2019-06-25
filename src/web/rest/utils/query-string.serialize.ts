export function serializeQuery(obj: any): string {
    return writeValue(obj);
}

function writeValue(val: any, ctx: any = ""): string {
    if (val.toJSON) {
        val = val.toJSON(ctx);
    }
    // array is technically an object, so we need to check explicitly
    if (Array.isArray(val)) {
        return writeArray(val);
    }
    switch (typeof val) {
        case "string":
            return `"${val.replace(/"/g, '\\"')}"`;
        case "number":
        case "boolean":
            return `${val}`;
        case "object":
            return writeObject(val);
        default:
            throw new Error(`Unable to serialize value: ${val}`);
    }
}

function writeObject(obj: { [key: string]: any }): string {
    return `{${Object.keys(obj)
        .map(key => `${key}=${writeValue(obj[key], key)}`)
        .join(',')}}`;
}

function writeArray(arr: any[]): string {
    return `[${arr.map(writeValue).join(',')}]`;
}
