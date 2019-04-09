export function cleanMongooseDocument(doc: any) {
    const {__v, _id, ...clean} = doc;
    clean.id = _id;
    return clean;
}
