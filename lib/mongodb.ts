// MongoDB removed - using static in-memory data
// TODO: Replace with a real database (Neon, Supabase, etc.) later

export const COLLECTIONS = {
  USERS: "users",
  PROFILES: "profiles",
  MESSAGES: "messages",
  CHATS: "chats",
  AUTOMATION_RULES: "automation_rules",
  ANALYTICS: "analytics",
  SESSIONS: "sessions",
} as const;
