import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "No seeding needed - using static in-memory data.",
    accounts: [
      {
        email: "admin@nexussync.com",
        password: "admin123456",
        role: "admin",
        name: "Yasin Adam Aissani",
      },
      {
        email: "demo@nexussync.com",
        password: "demo123456",
        role: "user",
        name: "Demo User",
      },
    ],
  });
}

    // Create indexes
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
    await db.collection(COLLECTIONS.PROFILES).createIndex({ userId: 1 });
    await db.collection(COLLECTIONS.MESSAGES).createIndex({ profileId: 1 });
    await db.collection(COLLECTIONS.SESSIONS).createIndex({ userId: 1 });
    await db.collection(COLLECTIONS.SESSIONS).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Check if demo user exists
    const existingUser = await db.collection(COLLECTIONS.USERS).findOne({
      email: "demo@nexussync.com",
    });

    if (!existingUser) {
      // Create demo user
      const hashedPassword = await bcrypt.hash("demo123456", 12);
      const userResult = await db.collection(COLLECTIONS.USERS).insertOne({
        email: "demo@nexussync.com",
        password: hashedPassword,
        name: "Demo User",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });

      // Create demo profiles
      const profiles = [
        {
          userId: userResult.insertedId,
          name: "NexusSync Official",
          platform: "instagram",
          username: "nexussync_official",
          avatar: "",
          bio: "Official NexusSync account",
          followers: 15234,
          following: 892,
          posts: 128,
          engagement: 4.8,
          status: "active",
          settings: {
            autoReply: true,
            autoReplyMessage: "Thanks for reaching out! We'll get back to you soon.",
            notificationsEnabled: true,
            language: "en",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: userResult.insertedId,
          name: "Tech Updates",
          platform: "twitter",
          username: "nexus_tech",
          avatar: "",
          bio: "Latest tech updates and news",
          followers: 8921,
          following: 456,
          posts: 342,
          engagement: 3.2,
          status: "active",
          settings: {
            autoReply: false,
            notificationsEnabled: true,
            language: "en",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: userResult.insertedId,
          name: "Business Network",
          platform: "linkedin",
          username: "nexussync",
          avatar: "",
          bio: "Professional networking and insights",
          followers: 5678,
          following: 234,
          posts: 89,
          engagement: 5.1,
          status: "active",
          settings: {
            autoReply: false,
            notificationsEnabled: true,
            language: "en",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await db.collection(COLLECTIONS.PROFILES).insertMany(profiles);

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
