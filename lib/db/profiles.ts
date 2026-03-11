import { ObjectId } from "mongodb";
import { getDatabase, COLLECTIONS } from "../mongodb";
import type { Profile, PaginatedResponse } from "./types";

export async function createProfile(
  userId: string | ObjectId,
  data: Omit<Profile, "_id" | "userId" | "createdAt" | "updatedAt">
): Promise<Profile> {
  const db = await getDatabase();
  const collection = db.collection<Profile>(COLLECTIONS.PROFILES);

  const profile: Profile = {
    userId: typeof userId === "string" ? new ObjectId(userId) : userId,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(profile);
  return { ...profile, _id: result.insertedId };
}

export async function findProfileById(id: string | ObjectId): Promise<Profile | null> {
  const db = await getDatabase();
  const collection = db.collection<Profile>(COLLECTIONS.PROFILES);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;
  return collection.findOne({ _id: objectId });
}

export async function findProfilesByUserId(
  userId: string | ObjectId,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<Profile>> {
  const db = await getDatabase();
  const collection = db.collection<Profile>(COLLECTIONS.PROFILES);
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;

  const total = await collection.countDocuments({ userId: objectId });
  const items = await collection
    .find({ userId: objectId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function updateProfile(
  id: string | ObjectId,
  data: Partial<Omit<Profile, "_id" | "userId" | "createdAt">>
): Promise<Profile | null> {
  const db = await getDatabase();
  const collection = db.collection<Profile>(COLLECTIONS.PROFILES);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return result;
}

export async function deleteProfile(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<Profile>(COLLECTIONS.PROFILES);
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  const result = await collection.deleteOne({ _id: objectId });
  return result.deletedCount > 0;
}

export async function getProfileStats(userId: string | ObjectId) {
  const db = await getDatabase();
  const collection = db.collection<Profile>(COLLECTIONS.PROFILES);
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;

  const profiles = await collection.find({ userId: objectId }).toArray();

  return {
    total: profiles.length,
    active: profiles.filter((p) => p.status === "active").length,
    paused: profiles.filter((p) => p.status === "paused").length,
    disconnected: profiles.filter((p) => p.status === "disconnected").length,
    totalFollowers: profiles.reduce((sum, p) => sum + p.followers, 0),
    totalFollowing: profiles.reduce((sum, p) => sum + p.following, 0),
    avgEngagement:
      profiles.length > 0
        ? profiles.reduce((sum, p) => sum + p.engagement, 0) / profiles.length
        : 0,
    byPlatform: profiles.reduce(
      (acc, p) => {
        acc[p.platform] = (acc[p.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}

export async function getAllProfiles(): Promise<Profile[]> {
  const db = await getDatabase();
  const collection = db.collection<Profile>(COLLECTIONS.PROFILES);
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}
