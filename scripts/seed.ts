import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  console.log("Please add your MongoDB URI to .env.local or set it as an environment variable.");
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("nexussync");

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("users")) {
      await db.createCollection("users");
      console.log("Created users collection");
    }

    if (!collectionNames.includes("profiles")) {
      await db.createCollection("profiles");
      console.log("Created profiles collection");
    }

    if (!collectionNames.includes("messages")) {
      await db.createCollection("messages");
      console.log("Created messages collection");
    }

    if (!collectionNames.includes("automations")) {
      await db.createCollection("automations");
      console.log("Created automations collection");
    }

    if (!collectionNames.includes("analytics")) {
      await db.createCollection("analytics");
      console.log("Created analytics collection");
    }

    if (!collectionNames.includes("sessions")) {
      await db.createCollection("sessions");
      console.log("Created sessions collection");
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("profiles").createIndex({ userId: 1 });
    await db.collection("messages").createIndex({ profileId: 1 });
    await db.collection("sessions").createIndex({ userId: 1 });
    await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    console.log("Created indexes");

    // Check if demo user exists
    const existingUser = await db.collection("users").findOne({
      email: "demo@nexussync.com",
    });

    if (!existingUser) {
      // Create demo user
      const hashedPassword = await bcrypt.hash("demo123456", 12);
      const userResult = await db.collection("users").insertOne({
        email: "demo@nexussync.com",
        password: hashedPassword,
        name: "Demo User",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });

      console.log("Created demo user");

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

      await db.collection("profiles").insertMany(profiles);
      console.log("Created demo profiles");
    } else {
      console.log("Demo user already exists");
    }

    console.log("\nSeeding complete!");
    console.log("\nDemo credentials:");
    console.log("Email: demo@nexussync.com");
    console.log("Password: demo123456");
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
