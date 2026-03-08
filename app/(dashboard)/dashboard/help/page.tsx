"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  ExternalLink,
  HelpCircle,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

const faqs = [
  {
    question: "How do I connect a new social media profile?",
    answer:
      "Navigate to the Profiles page and click 'Add Profile'. Select the platform you want to connect and follow the authorization steps. Make sure you have the necessary permissions to manage the account.",
  },
  {
    question: "How do automations work?",
    answer:
      "Automations allow you to set up rules that automatically respond to certain triggers. For example, you can automatically send a welcome message to new followers or reply to specific keywords. Go to the Automations page to create your first automation.",
  },
  {
    question: "What analytics data is available?",
    answer:
      "NexusSync provides comprehensive analytics including follower growth, engagement rates, impressions, reach, and platform-specific metrics. You can view data for individual profiles or get an overview across all connected accounts.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We take security seriously. All data is encrypted in transit and at rest. We use OAuth 2.0 for platform authentication and never store your social media passwords. You can enable two-factor authentication for additional security.",
  },
  {
    question: "Can I manage multiple team members?",
    answer:
      "Yes! With our team plan, you can invite team members and assign different roles and permissions. Each member can have access to specific profiles or features based on their role.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from the Settings page. Your access will continue until the end of your current billing period. All your data will be retained for 30 days after cancellation.",
  },
];

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API reference",
    icon: Book,
    href: "#",
  },
  {
    title: "Community",
    description: "Connect with other users and share tips",
    icon: Users,
    href: "#",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: BarChart3,
    href: "#",
  },
];

const quickLinks = [
  { title: "Getting Started Guide", icon: HelpCircle },
  { title: "Profile Management", icon: Users },
  { title: "Automation Basics", icon: Zap },
  { title: "Analytics Overview", icon: BarChart3 },
];

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Help Center</h2>
        <p className="text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-4">
        {quickLinks.map((link) => (
          <Card
            key={link.title}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{link.title}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="grid gap-4 md:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <resource.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {resource.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href={resource.href}>
                  Visit
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact support */}
      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>
            {"Our support team is here to assist you"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1">
            <MessageCircle className="mr-2 h-4 w-4" />
            Start Live Chat
          </Button>
          <Button variant="outline" className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Email Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
