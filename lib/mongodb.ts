import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Clean and validate the URI
let uri = process.env.MONGODB_URI.trim();

// Validate the URI format
function validateAndCleanMongoUri(inputUri: string): string {
  // Check for mongodb+srv format
  if (inputUri.startsWith("mongodb+srv://")) {
    try {
      // Use URL API to properly parse the URI
      const tempUri = inputUri.replace("mongodb+srv://", "https://");
      const parsed = new URL(tempUri);
      
      // Validate that we have a proper hostname (not just a username)
      if (!parsed.hostname || parsed.hostname.length < 3 || !parsed.hostname.includes(".")) {
        console.error("[v0] MongoDB URI appears to have an invalid hostname:", parsed.hostname);
        console.error("[v0] Expected format: mongodb+srv://username:password@cluster.mongodb.net/database");
        throw new Error("Invalid MongoDB URI format - hostname is missing or invalid. Please check your MONGODB_URI environment variable.");
      }
      
      // Reconstruct the URI without the port (mongodb+srv doesn't support ports)
      const auth = parsed.username ? 
        (parsed.password ? `${decodeURIComponent(parsed.username)}:${decodeURIComponent(parsed.password)}@` : `${decodeURIComponent(parsed.username)}@`) : 
        "";
      const path = parsed.pathname || "";
      const search = parsed.search || "";
      
      return `mongodb+srv://${auth}${parsed.hostname}${path}${search}`;
    } catch (e) {
      if (e instanceof Error && e.message.includes("Invalid MongoDB URI")) {
        throw e;
      }
      // If URL parsing fails, return original but warn
      console.error("[v0] Failed to parse MongoDB URI:", e);
      // Try simple regex to remove port
      return inputUri.replace(/(mongodb\+srv:\/\/[^@]*@[^/:]+):\d+/, "$1");
    }
  }
  
  // For standard mongodb:// URIs, just return as-is
  return inputUri;
}

uri = validateAndCleanMongoUri(uri);

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
