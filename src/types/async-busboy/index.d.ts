import * as http from "http";
import * as fs from "fs";
import * as busboy from "busboy";

interface Options extends busboy.BusboyConfig {
    onFile: (
        fieldname: string,
        file: NodeJS.ReadableStream,
        filename: string,
        encoding: string,
        mimetype: string) => void;
}

interface BusboyFile extends fs.ReadStream {
    fieldname: string;
    filename: string;
}

type AsyncBusboy = (
    req: http.IncomingMessage,
    options?: Options
) => Promise<{fields: {[key: string]: any}; files?: BusboyFile[]}>;

declare const asyncBusboy: AsyncBusboy;

export = asyncBusboy;