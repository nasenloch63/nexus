import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDatabase, COLLECTIONS } from "./mongodb";
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
  const db = await getDatabase();
  const sessionCollection = db.collection<Session>(COLLECTIONS.SESSIONS);

  // Create session in database
  const session: Session = {
    userId: user._id!,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + SESSION_DURATION),
    createdAt: new Date(),
  };

  const result = await sessionCollection.insertOne(session);

  // Create JWT token
  const token = await new SignJWT({
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
    sessionId: result.insertedId.toString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  // Update last login
  await updateLastLogin(user._id!);

  return token;
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

    // Verify session exists in database
    const db = await getDatabase();
    const sessionCollection = db.collection<Session>(COLLECTIONS.SESSIONS);
    const session = await sessionCollection.findOne({
      _id: new ObjectId(payload.sessionId),
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return null;
    }

    // Get user
    const user = await findUserById(payload.userId);
    if (!user || !user.isActive) {
      return null;
    }

    return { user, payload };
  } catch (error) {
    // Log the error but don't crash - treat as no session
    console.error("[v0] Error getting session:", error);
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const user = await findUserByEmail(email);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  if (!user.isActive) {
    return { success: false, error: "Account is deactivated" };
  }

  const isValidPassword = await validatePassword(password, user.password);
  if (!isValidPassword) {
    return { success: false, error: "Invalid email or password" };
  }

  const token = await createSession(user);
  return { success: true, token };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    const payload = await verifyToken(token);
    if (payload?.sessionId) {
      const db = await getDatabase();
      const sessionCollection = db.collection<Session>(COLLECTIONS.SESSIONS);
      await sessionCollection.deleteOne({ _id: new ObjectId(payload.sessionId) });
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
