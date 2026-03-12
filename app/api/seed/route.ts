import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Check if demo user exists
    const existingUsers = await sql`SELECT id FROM users WHERE email = 'demo@nexussync.com'`;

    if (existingUsers.length === 0) {
      // Create demo user
      const hashedPassword = await bcrypt.hash("demo123456", 12);
      const userResult = await sql`
        INSERT INTO users (email, password, name, role)
        VALUES ('demo@nexussync.com', ${hashedPassword}, 'Demo User', 'admin')
        RETURNING id
      `;

      const userId = userResult[0].id as string;

      // Create demo profiles
      await sql`
        INSERT INTO profiles (user_id, name, platform, username, bio, followers, following, posts, engagement, status, settings)
        VALUES 
          (${userId}, 'NexusSync Official', 'instagram', 'nexussync_official', 'Official NexusSync account', 15234, 892, 128, 4.8, 'active', '{"autoReply": true, "autoReplyMessage": "Thanks for reaching out!", "notificationsEnabled": true, "language": "en"}'),
          (${userId}, 'Tech Updates', 'twitter', 'nexus_tech', 'Latest tech updates and news', 8921, 456, 342, 3.2, 'active', '{"autoReply": false, "notificationsEnabled": true, "language": "en"}'),
          (${userId}, 'Business Network', 'linkedin', 'nexussync', 'Professional networking and insights', 5678, 234, 89, 5.1, 'active', '{"autoReply": false, "notificationsEnabled": true, "language": "en"}')
      `;

      return NextResponse.json({
        success: true,
        message: "Database seeded successfully!",
        credentials: {
          email: "demo@nexussync.com",
          password: "demo123456",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Demo user already exists",
      credentials: {
        email: "demo@nexussync.com",
        password: "demo123456",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
