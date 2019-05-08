import {ReadStream} from "fs";
import * as StreamSink from "streamsink";
import {createReadStream} from "streamifier";

export function streamToBuffer(source: ReadStream): Promise<Buffer> {
    const sink = new StreamSink();
    source.pipe(sink);
    return new Promise((resolve, reject) => {
        source.on("end", resolve);
        source.on("error", reject);
    }).then(() => sink.toBuffer());
}

export function bufferToStream(source: Buffer): ReadStream {
    return createReadStream(source);
}
