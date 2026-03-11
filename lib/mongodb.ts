import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Clean the URI - mongodb+srv URIs cannot have port numbers
let uri = process.env.MONGODB_URI;

console.log("[v0] Original MONGODB_URI (masked):", uri.replace(/\/\/[^@]+@/, "//****:****@"));

// Remove any port number from mongodb+srv URIs
if (uri.startsWith("mongodb+srv://")) {
  // More aggressive port removal - matches :port anywhere after @ and before / or ?
  // This handles all cases including when port is at the end
  uri = uri.replace(/(@[^/:]+):(\d+)(?=[\/?\s]|$)/g, "$1");
  console.log("[v0] Cleaned URI (masked):", uri.replace(/\/\/[^@]+@/, "//****:****@"));
}

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
