// Types file - MongoDB ObjectId replaced with plain string IDs
// MongoDB removed. TODO: Replace with real DB types later.

// User roles
export type UserRole = "admin" | "manager" | "user";

// User interface
export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

// Profile interface (managed profiles)
export interface Profile {
  _id?: string;
  userId: string;
  name: string;
  platform: "instagram" | "twitter" | "linkedin" | "facebook" | "tiktok";
  username: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  status: "active" | "paused" | "disconnected";
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  settings: ProfileSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileSettings {
  autoReply: boolean;
  autoReplyMessage?: string;
  notificationsEnabled: boolean;
  language: string;
}

// Message interface
export interface Message {
  _id?: string;
  profileId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  isIncoming: boolean;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Automation interface
export interface Automation {
  _id?: string;
  profileId: string;
  userId: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type: "keyword" | "time" | "event" | "webhook";
  conditions: Record<string, unknown>;
}

export interface AutomationAction {
  type: "send_message" | "like" | "follow" | "comment" | "webhook";
  config: Record<string, unknown>;
  delay?: number;
}

// Analytics interface
export interface Analytics {
  _id?: string;
  profileId: string;
  date: Date;
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    followers: number;
    following: number;
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
    messages: number;
  };
  topPosts?: Array<{
    postId: string;
    engagement: number;
    impressions: number;
  }>;
}

// Session interface
export interface Session {
  _id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard stats
export interface DashboardStats {
  totalProfiles: number;
  activeProfiles: number;
  totalMessages: number;
  unreadMessages: number;
  totalAutomations: number;
  activeAutomations: number;
  totalFollowers: number;
  followersGrowth: number;
  engagementRate: number;
  engagementGrowth: number;
}


// User interface
export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

// Profile interface (managed profiles)
export interface Profile {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  platform: "instagram" | "twitter" | "linkedin" | "facebook" | "tiktok";
  username: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  status: "active" | "paused" | "disconnected";
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  settings: ProfileSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileSettings {
  autoReply: boolean;
  autoReplyMessage?: string;
  notificationsEnabled: boolean;
  language: string;
}

// Message interface
export interface Message {
  _id?: ObjectId;
  profileId: ObjectId;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  isIncoming: boolean;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Automation interface
export interface Automation {
  _id?: ObjectId;
  profileId: ObjectId;
  userId: ObjectId;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type: "keyword" | "time" | "event" | "webhook";
  conditions: Record<string, unknown>;
}

export interface AutomationAction {
  type: "send_message" | "like" | "follow" | "comment" | "webhook";
  config: Record<string, unknown>;
  delay?: number; // delay in seconds
}

// Analytics interface
export interface Analytics {
  _id?: ObjectId;
  profileId: ObjectId;
  date: Date;
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    followers: number;
    following: number;
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
    messages: number;
  };
  topPosts?: Array<{
    postId: string;
    engagement: number;
    impressions: number;
  }>;
}

// Session interface (for auth)
export interface Session {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard stats
export interface DashboardStats {
  totalProfiles: number;
  activeProfiles: number;
  totalMessages: number;
  unreadMessages: number;
  totalAutomations: number;
  activeAutomations: number;
  totalFollowers: number;
  followersGrowth: number;
  engagementRate: number;
  engagementGrowth: number;
}
