import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { sql } from "./db";
import { findUserById, findUserByEmail, validatePassword, updateLastLogin } from "./db/users";
import type { User, Session } from "./db/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-characters-long!"
);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export async function createSession(user: User): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Create session in database
  const result = await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
    RETURNING id
  `;

  const sessionId = result[0].id as string;

  // Create JWT token
  const jwtToken = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId: sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  // Update last login
  await updateLastLogin(user.id);

  return jwtToken;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ user: User; payload: JWTPayload } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    // Verify session exists in database and is not expired
    const sessions = await sql`
      SELECT * FROM sessions 
      WHERE id = ${payload.sessionId} 
      AND expires_at > NOW()
    `;

    if (sessions.length === 0) {
      return null;
    }

    // Get user
    const user = await findUserById(payload.userId);
    if (!user || !user.is_active) {
      return null;
    }

    return { user, payload };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!user.is_active) {
      return { success: false, error: "Account is deactivated" };
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    const token = await createSession(user);
    return { success: true, token };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    const payload = await verifyToken(token);
    if (payload?.sessionId) {
      await sql`DELETE FROM sessions WHERE id = ${payload.sessionId}`;
    }
  }

  cookieStore.delete("session");
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}
