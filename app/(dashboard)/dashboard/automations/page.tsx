"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Zap,
  MessageSquare,
  Clock,
  TrendingUp,
  MoreVertical,
  Play,
  Pause,
  Settings,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const automations = [
  {
    id: "1",
    name: "Welcome Message",
    description: "Send a welcome message to new followers",
    trigger: "New follower",
    action: "Send DM",
    platform: "Instagram",
    status: "active",
    executions: 1234,
    lastRun: "2 hours ago",
  },
  {
    id: "2",
    name: "Thank You Reply",
    description: "Auto-reply to mentions with thank you",
    trigger: "Mention",
    action: "Reply",
    platform: "Twitter",
    status: "active",
    executions: 567,
    lastRun: "30 min ago",
  },
  {
    id: "3",
    name: "FAQ Response",
    description: "Respond to common questions automatically",
    trigger: "Keyword",
    action: "Send DM",
    platform: "All",
    status: "paused",
    executions: 892,
    lastRun: "1 day ago",
  },
  {
    id: "4",
    name: "Engagement Boost",
    description: "Like and comment on posts from engaged followers",
    trigger: "Schedule",
    action: "Like & Comment",
    platform: "Instagram",
    status: "active",
    executions: 2341,
    lastRun: "5 hours ago",
  },
];

const stats = [
  { label: "Total Automations", value: "4", icon: Zap },
  { label: "Active", value: "3", icon: Play },
  { label: "Total Executions", value: "5,034", icon: TrendingUp },
  { label: "Messages Sent", value: "1,801", icon: MessageSquare },
];

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automations</h2>
          <p className="text-muted-foreground">
            Create and manage automated responses and actions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automations list */}
      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
          <CardDescription>
            Manage your automated workflows and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{automation.name}</h4>
                      <Badge
                        variant={
                          automation.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {automation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {automation.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {automation.trigger}
                      </span>
                      <span>→</span>
                      <span>{automation.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {automation.platform}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {automation.executions.toLocaleString()} runs
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last run: {automation.lastRun}
                    </p>
                  </div>
                  <Switch checked={automation.status === "active"} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {automation.status === "active" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
