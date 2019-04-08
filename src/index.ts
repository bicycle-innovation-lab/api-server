import * as Mongoose from "mongoose";
import Connect from "./db/connect";
import {Server} from "./rest/server";

(async () => {
    await Connect();

    Server.listen(3000, () => console.log("Server listening..."));

    await Mongoose.disconnect();
})().catch(console.error);
