import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDatabase, COLLECTIONS } from "../mongodb";
import type { User, UserRole } from "./types";

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}): Promise<User> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);

  // Check if user already exists
  const existingUser = await collection.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user: User = {
    email: data.email.toLowerCase(),
    password: hashedPassword,
    name: data.name,
    role: data.role || "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  };

  const result = await collection.insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);
  return collection.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string | ObjectId): Promise<User | null> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;
  return collection.findOne({ _id: objectId });
}

export async function validatePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function updateUser(
  id: string | ObjectId,
  data: Partial<Omit<User, "_id" | "password" | "createdAt">>
): Promise<User | null> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return result;
}

export async function updatePassword(
  id: string | ObjectId,
  newPassword: string
): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const result = await collection.updateOne(
    { _id: objectId },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );

  return result.modifiedCount > 0;
}

export async function getAllUsers(): Promise<User[]> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);
  return collection.find({}).toArray();
}

export async function deleteUser(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  const result = await collection.deleteOne({ _id: objectId });
  return result.deletedCount > 0;
}

export async function updateLastLogin(id: string | ObjectId): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection<User>(COLLECTIONS.USERS);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  await collection.updateOne(
    { _id: objectId },
    { $set: { lastLoginAt: new Date() } }
  );
}
