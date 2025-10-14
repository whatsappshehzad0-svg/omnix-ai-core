import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Settings, 
  Crown, 
  Activity, 
  MessageSquare, 
  Clock, 
  Save,
  Edit3,
  Download,
  Upload,
  Search,
  Plus,
  Trash2,
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

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: "Mohd Shehzad Ahmed",
    email: "shehzad@example.com",
    title: "OMNIX Owner",
    joinDate: "2024-01-15",
    timezone: "UTC+5",
    language: "English"
  });

  // Chat history data
  const chatHistory: ChatHistory[] = [
    {
      id: '1',
      title: 'Code Review Help',
      lastMessage: 'Thanks for the detailed explanation!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      mode: 'code'
    },
    {
      id: '2',
      title: 'Weather in Tokyo',
      lastMessage: 'What about tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      mode: 'weather'
    },
    {
      id: '3',
      title: 'Document Summary',
      lastMessage: 'Can you make it shorter?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      mode: 'summarize'
    },
    {
      id: '4',
      title: 'French Translation',
      lastMessage: 'Perfect translation!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
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

  const stats = [
    { label: "Total Chats", value: "156", icon: MessageSquare, color: "text-blue-500" },
    { label: "Time Saved", value: "24h", icon: Clock, color: "text-green-500" },
    { label: "Commands Used", value: "1.2k", icon: Activity, color: "text-purple-500" },
    { label: "Modes Explored", value: "8/8", icon: Crown, color: "text-yellow-500" }
  ];

  const recentActivity = [
    { action: "Code Review", mode: "code", time: "2 hours ago" },
    { action: "Document Summary", mode: "summarize", time: "5 hours ago" },
    { action: "Weather Query", mode: "weather", time: "1 day ago" },
    { action: "Language Translation", mode: "translate", time: "2 days ago" }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="p-6 glass border-border/50">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary/30">
              <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-primary-foreground">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1">
              <Crown className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Crown className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
                <Badge variant="secondary">Premium</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Title:</span>
                <p className="font-medium">{profile.title}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Joined:</span>
                <p className="font-medium">{new Date(profile.joinDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Timezone:</span>
                <p className="font-medium">{profile.timezone}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 glass border-border/50 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-background/50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">Chat History</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="data">Data & Export</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="p-6 glass border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Profile Settings</h3>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center gap-2"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={profile.language}
                    onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Chat History Tab */}
        <TabsContent value="history">
          <Card className="p-6 glass border-border/50">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Chat History</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary-glow">
                  <Plus className="h-4 w-4 mr-1" />
                  New Chat
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Recent</span>
                <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                  {filteredHistory.length}
                </Badge>
              </div>

              {/* Chat List */}
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {filteredHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={cn(
                        "w-full p-4 rounded-lg text-left transition-all duration-200 group",
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
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No chats found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground text-center">
                  Total: {chatHistory.length} conversations
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="p-6 glass border-border/50">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">Mode: {activity.mode}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Data & Export Tab */}
        <TabsContent value="data">
          <Card className="p-6 glass border-border/50">
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Export Data</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Chat History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Profile Data
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Import Data</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Chat History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Preferences
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};