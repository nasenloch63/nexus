import { ObjectId } from "mongodb";

// User roles
export type UserRole = "admin" | "manager" | "user";

// User document
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

// Profile status
export type ProfileStatus = "active" | "inactive" | "pending" | "blocked";

// Profile document (managed accounts)
export interface Profile {
  _id?: ObjectId;
  userId: ObjectId; // Owner
  name: string;
  platform: string;
  username: string;
  avatar?: string;
  status: ProfileStatus;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  lastActivity?: Date;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chat document
export interface Chat {
  _id?: ObjectId;
  profileId: ObjectId;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Message document
export interface Message {
  _id?: ObjectId;
  chatId: ObjectId;
  profileId: ObjectId;
  content: string;
  isOutgoing: boolean;
  isRead: boolean;
  isAutomated: boolean;
  sentAt: Date;
  readAt?: Date;
}

// Automation rule document
export interface AutomationRule {
  _id?: ObjectId;
  userId: ObjectId;
  profileId?: ObjectId; // Optional: apply to specific profile or all
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type: "keyword" | "schedule" | "new_follower" | "new_message";
  keywords?: string[];
  schedule?: string; // Cron expression
}

export interface AutomationAction {
  type: "send_message" | "follow_back" | "like" | "archive";
  messageTemplate?: string;
  delay?: number; // In seconds
}

// Analytics document
export interface Analytics {
  _id?: ObjectId;
  profileId: ObjectId;
  date: Date;
  metrics: {
    followers: number;
    following: number;
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
    reach: number;
    impressions: number;
  };
}

// Session document for auth
export interface Session {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
  ip?: string;
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
  limit: number;
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
  engagementRate: number;
  growthRate: number;
}
