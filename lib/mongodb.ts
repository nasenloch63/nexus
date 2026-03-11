import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Clean the URI - mongodb+srv URIs cannot have port numbers
let uri = process.env.MONGODB_URI;

// Function to remove port from mongodb+srv URI - handles all cases
function cleanMongoSrvUri(inputUri: string): string {
  if (!inputUri.startsWith("mongodb+srv://")) {
    return inputUri;
  }
  
  // Use a global regex to remove ALL port patterns (:followed by digits)
  // that appear after @ and before / or ? or end of string
  // This handles: host:27017, host:27017/, host:27017?, host:27017/db?options
  
  const atIndex = inputUri.lastIndexOf("@");
  if (atIndex === -1) {
    return inputUri;
  }
  
  const beforeAt = inputUri.substring(0, atIndex + 1);
  const afterAt = inputUri.substring(atIndex + 1);
  
  // Remove any :PORT pattern from the host portion
  // Match :digits that are followed by /, ?, or end of string
  const cleanedAfterAt = afterAt
    .replace(/:(\d+)\//, "/")      // :port/ -> /
    .replace(/:(\d+)\?/, "?")      // :port? -> ?
    .replace(/:(\d+)$/, "");       // :port at end -> nothing
  
  return beforeAt + cleanedAfterAt;
}

uri = cleanMongoSrvUri(uri);

console.log("[v0] URI after cleaning (host only):", uri.includes("@") ? uri.substring(uri.lastIndexOf("@") + 1).split("/")[0].split("?")[0] : "no @ found");

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("nexussync");
}

// Alias for compatibility
export const getDatabase = getDb;

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  PROFILES: "profiles",
  MESSAGES: "messages",
  CHATS: "chats",
  AUTOMATION_RULES: "automation_rules",
  ANALYTICS: "analytics",
  SESSIONS: "sessions",
} as const;
