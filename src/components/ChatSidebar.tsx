import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  Trash2, 
  Edit3,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  mode?: string;
}

export const ChatSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Mock chat history data
  const chatHistory: ChatHistory[] = [
    {
      id: '1',
      title: 'Code Review Help',
      lastMessage: 'Thanks for the detailed explanation!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      mode: 'code'
    },
    {
      id: '2',
      title: 'Weather in Tokyo',
      lastMessage: 'What about tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      mode: 'weather'
    },
    {
      id: '3',
      title: 'Document Summary',
      lastMessage: 'Can you make it shorter?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      mode: 'summarize'
    },
    {
      id: '4',
      title: 'French Translation',
      lastMessage: 'Perfect translation!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      mode: 'translate'
    }
  ];

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getModeColor = (mode?: string) => {
    const colors = {
      code: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      weather: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
      summarize: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      translate: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      default: 'bg-primary/10 text-primary border-primary/20'
    };
    return colors[mode as keyof typeof colors] || colors.default;
  };

  return (
    <Card className="w-80 glass border-border/50 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Chat History</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary-glow">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Filter Options */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Recent</span>
          <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
            {filteredHistory.length}
          </Badge>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200 group",
                "hover:bg-primary/5 hover:border-primary/20 border border-transparent",
                selectedChat === chat.id && "bg-primary/10 border-primary/30"
              )}
            >
              <div className="space-y-2">
                {/* Chat Title & Mode */}
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm text-foreground truncate flex-1 mr-2">
                    {chat.title}
                  </h4>
                  {chat.mode && (
                    <Badge className={cn("text-xs px-1 py-0 h-4", getModeColor(chat.mode))}>
                      {chat.mode}
                    </Badge>
                  )}
                </div>
                
                {/* Last Message */}
                <p className="text-xs text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
                
                {/* Timestamp & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(chat.timestamp)}
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border/50">
        <div className="text-xs text-muted-foreground text-center">
          Total: {chatHistory.length} conversations
        </div>
      </div>
    </Card>
  );
};