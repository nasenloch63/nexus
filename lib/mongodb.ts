import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Clean the URI - mongodb+srv URIs cannot have port numbers
let uri = process.env.MONGODB_URI;

// Function to remove port from mongodb+srv URI
function cleanMongoSrvUri(inputUri: string): string {
  if (!inputUri.startsWith("mongodb+srv://")) {
    return inputUri;
  }
  
  // Find the @ symbol that separates credentials from host
  const atIndex = inputUri.lastIndexOf("@");
  if (atIndex === -1) {
    return inputUri;
  }
  
  const credentials = inputUri.substring(0, atIndex + 1);
  const hostAndRest = inputUri.substring(atIndex + 1);
  
  // Find where the host ends (first / or ? or end of string)
  const slashIndex = hostAndRest.indexOf("/");
  const questionIndex = hostAndRest.indexOf("?");
  
  let hostEndIndex = hostAndRest.length;
  if (slashIndex !== -1 && (questionIndex === -1 || slashIndex < questionIndex)) {
    hostEndIndex = slashIndex;
  } else if (questionIndex !== -1) {
    hostEndIndex = questionIndex;
  }
  
  const host = hostAndRest.substring(0, hostEndIndex);
  const rest = hostAndRest.substring(hostEndIndex);
  
  // Remove port from host (pattern: hostname:port -> hostname)
  const cleanedHost = host.replace(/:(\d+)$/, "");
  
  return credentials + cleanedHost + rest;
}

uri = cleanMongoSrvUri(uri);

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
