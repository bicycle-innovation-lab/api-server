import * as Mongoose from "mongoose";

const MongoDBUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/admin";

export default async function Connect() {
    await Mongoose.connect(MongoDBUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
}
