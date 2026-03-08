"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Zap, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    totalFollowers: number;
    avgEngagement: number;
  } | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Profiles",
      value: stats?.total ?? 0,
      change: "+2",
      changeType: "positive" as const,
      icon: Users,
      description: "Active accounts",
    },
    {
      title: "Total Followers",
      value: stats?.totalFollowers ?? 0,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Across all profiles",
    },
    {
      title: "Messages",
      value: 0,
      change: "+48",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "Unread messages",
    },
    {
      title: "Engagement Rate",
      value: `${(stats?.avgEngagement ?? 0).toFixed(1)}%`,
      change: "-0.3%",
      changeType: "negative" as const,
      icon: Zap,
      description: "Average across profiles",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof card.value === "number"
                ? card.value.toLocaleString()
                : card.value}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span
                className={cn(
                  "flex items-center",
                  card.changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {card.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {card.change}
              </span>
              <span>{card.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
