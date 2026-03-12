import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createProfile, findProfilesByUserId, getProfileStats } from "@/lib/db/profiles";
import type { Profile } from "@/lib/db/types";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const profiles = await findProfilesByUserId(session.user.id, page, pageSize);
    const stats = await getProfileStats(session.user.id);

    return NextResponse.json({ ...profiles, stats });
  } catch (error) {
    console.error("Get profiles error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    const profileData: Omit<Profile, "id" | "user_id" | "created_at" | "updated_at"> = {
      name,
      platform,
      username,
      bio: bio || "",
      avatar: avatar || "",
      followers: 0,
      following: 0,
      posts: 0,
      engagement: 0,
      status: "active",
      settings: {
        autoReply: false,
        notificationsEnabled: true,
        language: "en",
      },
    };

    const profile = await createProfile(session.user.id, profileData);

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
