"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Send, Zap, BarChart3 } from "lucide-react";

const actions = [
  {
    title: "Add Profile",
    description: "Connect a new social media account",
    icon: Plus,
    href: "/dashboard/profiles/new",
    variant: "default" as const,
  },
  {
    title: "Send Message",
    description: "Quick reply to conversations",
    icon: Send,
    href: "/dashboard/messages",
    variant: "outline" as const,
  },
  {
    title: "Create Automation",
    description: "Set up automated responses",
    icon: Zap,
    href: "/dashboard/automations/new",
    variant: "outline" as const,
  },
  {
    title: "View Analytics",
    description: "Check your performance metrics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can do right now</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button
              variant={action.variant}
              className="w-full justify-start gap-3 h-auto py-3"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <action.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
