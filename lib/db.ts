// Neon PostgreSQL Database Client (v4.0)
// IMPORTANT: This project uses Neon PostgreSQL, NOT MongoDB
import { neon } from "@neondatabase/serverless";

// Create a reusable SQL client for Neon serverless PostgreSQL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const sql = neon(databaseUrl);

export { sql };

// Helper to handle database errors
export function handleDbError(error: unknown): never {
  console.error("Database error:", error);
  if (error instanceof Error) {
    throw new Error(`Database error: ${error.message}`);
  }
  throw new Error("An unknown database error occurred");
}
