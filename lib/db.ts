import { neon } from "@neondatabase/serverless";

// Create a reusable SQL client
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Helper to handle database errors
export function handleDbError(error: unknown): never {
  console.error("Database error:", error);
  if (error instanceof Error) {
    throw new Error(`Database error: ${error.message}`);
  }
  throw new Error("An unknown database error occurred");
}
