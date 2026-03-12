import bcrypt from "bcryptjs";
import { sql } from "../db";
import type { User, UserRole } from "./types";

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}): Promise<User> {
  // Check if user already exists
  const existing = await sql`SELECT id FROM users WHERE email = ${data.email.toLowerCase()}`;
  if (existing.length > 0) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const result = await sql`
    INSERT INTO users (email, password, name, role)
    VALUES (${data.email.toLowerCase()}, ${hashedPassword}, ${data.name}, ${data.role || "user"})
    RETURNING *
  `;

  return result[0] as User;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
  return result.length > 0 ? (result[0] as User) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  return result.length > 0 ? (result[0] as User) : null;
}

export async function validatePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "password" | "created_at">>
): Promise<User | null> {
  const result = await sql`
    UPDATE users
    SET 
      name = COALESCE(${data.name ?? null}, name),
      role = COALESCE(${data.role ?? null}, role),
      avatar = COALESCE(${data.avatar ?? null}, avatar),
      is_active = COALESCE(${data.is_active ?? null}, is_active),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result.length > 0 ? (result[0] as User) : null;
}

export async function updatePassword(id: string, newPassword: string): Promise<boolean> {
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const result = await sql`
    UPDATE users
    SET password = ${hashedPassword}, updated_at = NOW()
    WHERE id = ${id}
  `;
  return (result as unknown as { count: number }).count > 0;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await sql`SELECT * FROM users ORDER BY created_at DESC`;
  return result as User[];
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM users WHERE id = ${id}`;
  return (result as unknown as { count: number }).count > 0;
}

export async function updateLastLogin(id: string): Promise<void> {
  try {
    await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${id}`;
  } catch (error) {
    console.error("Failed to update last login:", error);
  }
}
