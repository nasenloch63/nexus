import { sql } from "../db";
import type { Profile, PaginatedResponse, ProfileSettings } from "./types";

export async function createProfile(
  userId: string,
  data: Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Profile> {
  const result = await sql`
    INSERT INTO profiles (user_id, name, platform, username, avatar, bio, followers, following, posts, engagement, status, settings)
    VALUES (
      ${userId}, 
      ${data.name}, 
      ${data.platform}, 
      ${data.username}, 
      ${data.avatar ?? null}, 
      ${data.bio ?? null}, 
      ${data.followers}, 
      ${data.following}, 
      ${data.posts}, 
      ${data.engagement}, 
      ${data.status},
      ${JSON.stringify(data.settings)}
    )
    RETURNING *
  `;
  return parseProfile(result[0]);
}

export async function findProfileById(id: string): Promise<Profile | null> {
  const result = await sql`SELECT * FROM profiles WHERE id = ${id}`;
  return result.length > 0 ? parseProfile(result[0]) : null;
}

export async function findProfilesByUserId(
  userId: string,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<Profile>> {
  const offset = (page - 1) * pageSize;

  const countResult = await sql`SELECT COUNT(*) as count FROM profiles WHERE user_id = ${userId}`;
  const total = parseInt(countResult[0].count as string, 10);

  const items = await sql`
    SELECT * FROM profiles 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  return {
    items: items.map(parseProfile),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function updateProfile(
  id: string,
  data: Partial<Omit<Profile, "id" | "user_id" | "created_at">>
): Promise<Profile | null> {
  const result = await sql`
    UPDATE profiles
    SET 
      name = COALESCE(${data.name ?? null}, name),
      username = COALESCE(${data.username ?? null}, username),
      avatar = COALESCE(${data.avatar ?? null}, avatar),
      bio = COALESCE(${data.bio ?? null}, bio),
      followers = COALESCE(${data.followers ?? null}, followers),
      following = COALESCE(${data.following ?? null}, following),
      posts = COALESCE(${data.posts ?? null}, posts),
      engagement = COALESCE(${data.engagement ?? null}, engagement),
      status = COALESCE(${data.status ?? null}, status),
      settings = COALESCE(${data.settings ? JSON.stringify(data.settings) : null}, settings),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result.length > 0 ? parseProfile(result[0]) : null;
}

export async function deleteProfile(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM profiles WHERE id = ${id}`;
  return (result as unknown as { count: number }).count > 0;
}

export async function getProfileStats(userId: string) {
  const profiles = await sql`SELECT * FROM profiles WHERE user_id = ${userId}`;
  const profileList = profiles.map(parseProfile);

  return {
    total: profileList.length,
    active: profileList.filter((p) => p.status === "active").length,
    paused: profileList.filter((p) => p.status === "paused").length,
    disconnected: profileList.filter((p) => p.status === "disconnected").length,
    totalFollowers: profileList.reduce((sum, p) => sum + p.followers, 0),
    totalFollowing: profileList.reduce((sum, p) => sum + p.following, 0),
    avgEngagement:
      profileList.length > 0
        ? profileList.reduce((sum, p) => sum + p.engagement, 0) / profileList.length
        : 0,
    byPlatform: profileList.reduce(
      (acc, p) => {
        acc[p.platform] = (acc[p.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}

export async function getAllProfiles(): Promise<Profile[]> {
  const result = await sql`SELECT * FROM profiles ORDER BY created_at DESC`;
  return result.map(parseProfile);
}

// Helper to parse profile with proper settings type
function parseProfile(row: Record<string, unknown>): Profile {
  return {
    ...row,
    settings: (typeof row.settings === "string" 
      ? JSON.parse(row.settings) 
      : row.settings) as ProfileSettings,
  } as Profile;
}
