// lib/mongodb.js
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const options = {};

// let client;
// let clientPromise;

if (!process.env.MONGODB_URI) throw new Error("Add MONGODB_URI to .env.local");

// if (process.env.NODE_ENV === "development") {
// 	if (!global._mongoClientPromise) {
// 		client = new MongoClient(uri, options);
// 		global._mongoClientPromise = client.connect();
// 	}
// 	clientPromise = global._mongoClientPromise;
// } else {
// 	client = new MongoClient(uri, options);
// 	clientPromise = client.connect();
// }
let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				bufferCommands: false,
			})
			.then((mongoose) => mongoose);
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

// export default clientPromise;
