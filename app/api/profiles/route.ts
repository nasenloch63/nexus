import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// In-memory profile store (per session, resets on server restart)
const profileStore: Record<string, Profile[]> = {};

export interface Profile {
  id: string;
  userId: string;
  name: string;
  platform: "instagram" | "twitter" | "linkedin" | "facebook" | "tiktok";
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  status: "active" | "paused" | "disconnected";
  createdAt: string;
}

function getUserProfiles(userId: string): Profile[] {
  if (!profileStore[userId]) {
    // Seed with demo profiles
    profileStore[userId] = [
      {
        id: "p1",
        userId,
        name: "NexusSync Official",
        platform: "instagram",
        username: "@nexussync",
        avatar: "",
        bio: "Official NexusSync account",
        followers: 12400,
        following: 320,
        posts: 145,
        engagement: 4.7,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "p2",
        userId,
        name: "NexusSync Twitter",
        platform: "twitter",
        username: "@nexussync",
        avatar: "",
        bio: "Updates and news",
        followers: 8900,
        following: 210,
        posts: 892,
        engagement: 3.2,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "p3",
        userId,
        name: "NexusSync LinkedIn",
        platform: "linkedin",
        username: "nexussync",
        avatar: "",
        bio: "Professional updates",
        followers: 5600,
        following: 180,
        posts: 67,
        engagement: 5.1,
        status: "paused",
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return profileStore[userId];
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const allProfiles = getUserProfiles(session.user.id);
    const start = (page - 1) * pageSize;
    const items = allProfiles.slice(start, start + pageSize);

    const stats = {
      total: allProfiles.length,
      active: allProfiles.filter((p) => p.status === "active").length,
      paused: allProfiles.filter((p) => p.status === "paused").length,
      totalFollowers: allProfiles.reduce((sum, p) => sum + p.followers, 0),
    };

    return NextResponse.json({
      items,
      total: allProfiles.length,
      page,
      pageSize,
      totalPages: Math.ceil(allProfiles.length / pageSize),
      stats,
    });
  } catch (error) {
    console.error("Get profiles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, platform, username, bio, avatar } = body;

    if (!name || !platform || !username) {
      return NextResponse.json(
        { error: "Name, platform, and username are required" },
        { status: 400 }
      );
    }

    const profiles = getUserProfiles(session.user.id);
    const newProfile: Profile = {
      id: `p${Date.now()}`,
      userId: session.user.id,
      name,
      platform,
      username,
      avatar: avatar || "",
      bio: bio || "",
      followers: 0,
      following: 0,
      posts: 0,
      engagement: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    return NextResponse.json({ success: true, profile: newProfile });
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
