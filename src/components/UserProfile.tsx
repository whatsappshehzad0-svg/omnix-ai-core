import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Upload
} from "lucide-react";

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Mohd Shehzad Ahmed",
    email: "shehzad@example.com",
    title: "OMNIX Owner",
    joinDate: "2024-01-15",
    timezone: "UTC+5",
    language: "English"
  });

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
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