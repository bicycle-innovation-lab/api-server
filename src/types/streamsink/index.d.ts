import {Writable} from "stream";

declare namespace StreamSink {
}

declare class StreamSink extends Writable {
    toBuffer(): Buffer;
}

export = StreamSink;
