import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your environment.");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached = (global as unknown as { mongoose?: MongooseCache }).mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as unknown as { mongoose: MongooseCache }).mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
