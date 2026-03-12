// User roles
export type UserRole = "admin" | "manager" | "user";

// User interface
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  is_active: boolean;
  last_login_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Profile interface (managed social media profiles)
export type Platform = "instagram" | "twitter" | "linkedin" | "facebook" | "tiktok";
export type ProfileStatus = "active" | "paused" | "disconnected";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  platform: Platform;
  username: string;
  avatar?: string | null;
  bio?: string | null;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  status: ProfileStatus;
  access_token?: string | null;
  refresh_token?: string | null;
  token_expires_at?: Date | null;
  settings: ProfileSettings;
  created_at: Date;
  updated_at: Date;
}

export interface ProfileSettings {
  autoReply: boolean;
  autoReplyMessage?: string;
  notificationsEnabled: boolean;
  language: string;
}

// Message interface
export type MessageType = "text" | "image" | "video" | "audio" | "file";

export interface Message {
  id: string;
  profile_id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string | null;
  content: string;
  type: MessageType;
  is_incoming: boolean;
  is_read: boolean;
  metadata?: Record<string, unknown> | null;
  created_at: Date;
}

// Automation interface
export type TriggerType = "keyword" | "time" | "event" | "webhook";
export type ActionType = "send_message" | "like" | "follow" | "comment" | "webhook";

export interface Automation {
  id: string;
  profile_id: string;
  user_id: string;
  name: string;
  description?: string | null;
  trigger_type: TriggerType;
  trigger_conditions: Record<string, unknown>;
  actions: AutomationAction[];
  is_active: boolean;
  execution_count: number;
  last_executed_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AutomationAction {
  type: ActionType;
  config: Record<string, unknown>;
  delay?: number;
}

// Analytics interface
export interface Analytics {
  id: string;
  profile_id: string;
  date: Date;
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
  top_posts?: Array<{
    postId: string;
    engagement: number;
    impressions: number;
  }> | null;
  created_at: Date;
}

// Session interface (for auth)
export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  user_agent?: string | null;
  ip_address?: string | null;
  created_at: Date;
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
