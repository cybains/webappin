// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/';


if (!uri) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables.');
}


const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
