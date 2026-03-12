-- Seed demo data for NexusSync
-- Only insert if demo user doesn't exist

-- Note: This is a one-time seed. The password hash is for "demo123456"
-- Hash generated with bcrypt, cost factor 12

INSERT INTO users (email, password, name, role)
SELECT 'demo@nexussync.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.pJqmxRiN6C5V6.', 'Demo User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@nexussync.com');

-- Insert profiles for the demo user
INSERT INTO profiles (user_id, name, platform, username, bio, followers, following, posts, engagement, status, settings)
SELECT 
  u.id,
  'NexusSync Official',
  'instagram',
  'nexussync_official',
  'Official NexusSync account',
  15234,
  892,
  128,
  4.8,
  'active',
  '{"autoReply": true, "autoReplyMessage": "Thanks for reaching out!", "notificationsEnabled": true, "language": "en"}'
FROM users u
WHERE u.email = 'demo@nexussync.com'
AND NOT EXISTS (SELECT 1 FROM profiles WHERE username = 'nexussync_official');

INSERT INTO profiles (user_id, name, platform, username, bio, followers, following, posts, engagement, status, settings)
SELECT 
  u.id,
  'Tech Updates',
  'twitter',
  'nexus_tech',
  'Latest tech updates and news',
  8921,
  456,
  342,
  3.2,
  'active',
  '{"autoReply": false, "notificationsEnabled": true, "language": "en"}'
FROM users u
WHERE u.email = 'demo@nexussync.com'
AND NOT EXISTS (SELECT 1 FROM profiles WHERE username = 'nexus_tech');

INSERT INTO profiles (user_id, name, platform, username, bio, followers, following, posts, engagement, status, settings)
SELECT 
  u.id,
  'Business Network',
  'linkedin',
  'nexussync',
  'Professional networking and insights',
  5678,
  234,
  89,
  5.1,
  'active',
  '{"autoReply": false, "notificationsEnabled": true, "language": "en"}'
FROM users u
WHERE u.email = 'demo@nexussync.com'
AND NOT EXISTS (SELECT 1 FROM profiles WHERE username = 'nexussync' AND platform = 'linkedin');
