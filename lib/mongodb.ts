import { MongoClient, Db, MongoClientOptions } from "mongodb";

// MongoDB connection URI with the correct format for MongoDB Atlas
const uri = "mongodb+srv://yasinaissani_db_user:Nasaer300419!@nasenloch63.k5hwgo0.mongodb.net/nexussync?retryWrites=true&w=majority&appName=nasenloch63";

// MongoDB client options with TLS configuration for Node.js compatibility
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  // TLS settings - allow invalid certificates for sandbox environments
  // This is needed because the v0 sandbox has SSL/TLS compatibility issues
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
};

console.log("[v0] MongoDB: Attempting to connect with URI (masked):", uri.replace(/\/\/[^@]+@/, "//****:****@"));

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
