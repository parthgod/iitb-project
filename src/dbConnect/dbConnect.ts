import mongoose from "mongoose";

if (!process.env.MONGODB_URL) {
    throw new Error("Please add your MONGODB_URL to .env.local");
}

const MONGODB_URL: string = process.env.MONGODB_URL;


let globalWithMongoose = global as typeof globalThis & {
    mongoose: any;
};
let cached = globalWithMongoose.mongoose;

if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}


async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;