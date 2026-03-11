import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Reference the same in-memory store from the profiles route
// In a real app this would be a database
const profileStore: Record<string, Array<{
  id: string;
  userId: string;
  name: string;
  platform: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  status: string;
  createdAt: string;
}>> = {};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const profiles = profileStore[session.user.id] || [];
    const profile = profiles.find((p) => p.id === id);

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const profiles = profileStore[session.user.id] || [];
    const index = profiles.findIndex((p) => p.id === id);

    if (index === -1) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await request.json();
    profiles[index] = { ...profiles[index], ...body };

    return NextResponse.json({ success: true, profile: profiles[index] });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const profiles = profileStore[session.user.id] || [];
    const index = profiles.findIndex((p) => p.id === id);

    if (index === -1) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    profiles.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
