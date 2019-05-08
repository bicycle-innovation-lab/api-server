import {ReadStream, WriteStream} from "fs";
import * as Mongoose from "mongoose";
import {GridFSBucket, ObjectID} from "mongodb";

function getGrid() {
    const db = Mongoose.connection.db;
    return new GridFSBucket(db);
}

export async function uploadFile(name: string, stream: ReadStream): Promise<ObjectID | null> {
    const grid = getGrid();
    const up = grid.openUploadStream(name);

    stream.pipe(up);
    return new Promise((resolve, reject) => {
        up.on("finish", () => resolve(up.id as ObjectID));
        up.on("error", reject);
    });
}

export function downloadFile(id: ObjectID) {
    const grid = getGrid();
    return grid.openDownloadStream(id);
}

export function pipeFile(id: ObjectID, stream: WriteStream) {
    const grid = getGrid();
    const down = grid.openDownloadStream(id);
    return down.pipe(stream)
}
