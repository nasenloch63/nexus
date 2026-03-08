"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";

// Demo conversations
const conversations = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "",
    lastMessage: "Hey, I love your content! Would you be interested in a collab?",
    time: "2m ago",
    unread: 2,
    platform: "Instagram",
    online: true,
  },
  {
    id: "2",
    name: "Tech Weekly",
    avatar: "",
    lastMessage: "Thanks for the interview! The article will be published next week.",
    time: "1h ago",
    unread: 0,
    platform: "Twitter",
    online: false,
  },
  {
    id: "3",
    name: "Marketing Pro",
    avatar: "",
    lastMessage: "Could you share some tips for our community?",
    time: "3h ago",
    unread: 1,
    platform: "LinkedIn",
    online: true,
  },
  {
    id: "4",
    name: "Digital Trends",
    avatar: "",
    lastMessage: "We'd like to feature you in our newsletter!",
    time: "1d ago",
    unread: 0,
    platform: "Facebook",
    online: false,
  },
];

const messages = [
  {
    id: "1",
    sender: "Sarah Johnson",
    content: "Hey! I've been following your account for a while now.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    content: "Your content is amazing! I especially loved the recent post about productivity tips.",
    time: "10:31 AM",
    isMe: false,
  },
  {
    id: "3",
    sender: "Me",
    content: "Hi Sarah! Thank you so much, that means a lot! 😊",
    time: "10:35 AM",
    isMe: true,
  },
  {
    id: "4",
    sender: "Sarah Johnson",
    content: "Would you be interested in doing a collaboration? I think our audiences would really benefit!",
    time: "10:36 AM",
    isMe: false,
  },
  {
    id: "5",
    sender: "Me",
    content: "That sounds interesting! What did you have in mind?",
    time: "10:40 AM",
    isMe: true,
  },
  {
    id: "6",
    sender: "Sarah Johnson",
    content: "Hey, I love your content! Would you be interested in a collab?",
    time: "10:42 AM",
    isMe: false,
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversations list */}
      <Card className="w-80 shrink-0 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Messages</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            {filteredConversations.map((conv) => (
              <div key={conv.id}>
                <button
                  className={cn(
                    "w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-start gap-3",
                    selectedConversation.id === conv.id && "bg-muted"
                  )}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conv.avatar} />
                      <AvatarFallback>
                        {conv.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{conv.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {conv.platform}
                      </Badge>
                      {conv.unread > 0 && (
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
                <Separator />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedConversation.avatar} />
              <AvatarFallback>
                {selectedConversation.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedConversation.name}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.online ? (
                  <span className="text-green-600">Online</span>
                ) : (
                  "Offline"
                )}
                {" · "}
                {selectedConversation.platform}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isMe ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2",
                    message.isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.isMe
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newMessage.trim()) {
                  // Handle send
                  setNewMessage("");
                }
              }}
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
