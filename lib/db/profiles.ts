// Profiles helper - returns static in-memory stats
// MongoDB removed. No external dependencies. v3

export interface ProfileStats {
  total: number;
  active: number;
  paused: number;
  disconnected: number;
  totalFollowers: number;
  totalFollowing: number;
  avgEngagement: number;
  byPlatform: Record<string, number>;
}

// Static demo profile data used across the app
export const DEMO_PROFILES = [
  {
    _id: "profile_1",
    userId: "user_admin",
    name: "NexusSync Official",
    platform: "instagram" as const,
    username: "nexussync_official",
    avatar: "",
    bio: "Official NexusSync account",
    followers: 15234,
    following: 892,
    posts: 128,
    engagement: 4.8,
    status: "active" as const,
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
    _id: "profile_2",
    userId: "user_admin",
    name: "Tech Updates",
    platform: "twitter" as const,
    username: "nexus_tech",
    avatar: "",
    bio: "Latest tech updates and news",
    followers: 8921,
    following: 456,
    posts: 342,
    engagement: 3.2,
    status: "active" as const,
    settings: {
      autoReply: false,
      notificationsEnabled: true,
      language: "en",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "profile_3",
    userId: "user_admin",
    name: "Business Network",
    platform: "linkedin" as const,
    username: "nexussync",
    avatar: "",
    bio: "Professional networking and insights",
    followers: 5678,
    following: 234,
    posts: 89,
    engagement: 5.1,
    status: "active" as const,
    settings: {
      autoReply: false,
      notificationsEnabled: true,
      language: "en",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getProfileStats(_userId: string): Promise<ProfileStats> {
  const profiles = DEMO_PROFILES;

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
