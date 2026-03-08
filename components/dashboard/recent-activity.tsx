"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, UserPlus, Share2 } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "message",
    user: "Sarah Johnson",
    avatar: "",
    action: "sent you a message",
    content: "Hey, I love your content!",
    time: "2 min ago",
    platform: "Instagram",
  },
  {
    id: 2,
    type: "follower",
    user: "Tech Weekly",
    avatar: "",
    action: "started following you",
    content: null,
    time: "15 min ago",
    platform: "Twitter",
  },
  {
    id: 3,
    type: "like",
    user: "Marketing Pro",
    avatar: "",
    action: "liked your post",
    content: "10 Tips for Social Media Growth",
    time: "1 hour ago",
    platform: "LinkedIn",
  },
  {
    id: 4,
    type: "share",
    user: "Digital Trends",
    avatar: "",
    action: "shared your post",
    content: "The Future of Content Creation",
    time: "3 hours ago",
    platform: "Facebook",
  },
];

const iconMap = {
  message: MessageSquare,
  like: Heart,
  follower: UserPlus,
  share: Share2,
};

const colorMap = {
  message: "text-blue-500",
  like: "text-red-500",
  follower: "text-green-500",
  share: "text-purple-500",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest interactions across your profiles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type as keyof typeof iconMap];
            const color = colorMap[activity.type as keyof typeof colorMap];

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground">{activity.action}</span>
                    <Badge variant="secondary" className="text-xs">
                      {activity.platform}
                    </Badge>
                  </div>
                  {activity.content && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {activity.content}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <div className={`shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
