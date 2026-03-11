import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nexussync-secret-key-min-32-characters-long!"
);

const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// Static users - no database needed
export const STATIC_USERS = [
  {
    id: "admin-001",
    email: "admin@nexussync.com",
    password: "admin123456",
    name: "Yasin Adam Aissani",
    role: "admin" as const,
    avatar: "",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "demo-001",
    email: "demo@nexussync.com",
    password: "demo123456",
    name: "Demo User",
    role: "user" as const,
    avatar: "",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
];

export type StaticUser = (typeof STATIC_USERS)[0];

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function createToken(user: StaticUser): Promise<string> {
  return await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function getSession(): Promise<{ user: StaticUser; payload: JWTPayload } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = STATIC_USERS.find((u) => u.id === payload.userId);
    if (!user || !user.isActive) return null;

    return { user, payload };
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const user = STATIC_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  if (!user.isActive) {
    return { success: false, error: "Account is deactivated" };
  }

  const token = await createToken(user);
  return { success: true, token };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
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
