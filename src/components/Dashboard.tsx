import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeBox } from "@/components/ModeBox";
import { ChatInterface } from "@/components/ChatInterface";
import { UserProfile } from "@/components/UserProfile";
import { Brain, MessageSquare, User, Settings, Zap } from "lucide-react";

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const smartModes = [
    {
      id: 'summarize',
      title: '📑 Summarize',
      description: 'Condense long texts into key points',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'translate',
      title: '🌍 Translate',
      description: 'Convert text between languages',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'explain-simple',
      title: '💡 Explain Simple',
      description: 'Break down complex topics simply',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'explain-deep',
      title: '📘 Explain Deep',
      description: 'Detailed technical explanations',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'code',
      title: '💻 Code Mode',
      description: 'Programming assistance and debugging',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'calculator',
      title: '🧮 Calculator',
      description: 'Advanced mathematical computations',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'news',
      title: '📰 News',
      description: 'Latest updates and current events',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'weather',
      title: '☁️ Weather',
      description: 'Weather forecasts and conditions',
      gradient: 'from-sky-500 to-blue-500'
    }
  ];

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary animate-glow-pulse" />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  OMNIX
                </h1>
                <p className="text-sm text-muted-foreground">All across everything</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
              
              <nav className="flex space-x-2">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                  className="text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'chat' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('chat')}
                  className="text-sm"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button
                  variant={currentView === 'profile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('profile')}
                  className="text-sm"
                >
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Welcome to the Future of AI Assistance
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose your smart mode below and experience the power of OMNIX across all domains
              </p>
            </div>

            {/* Smart Modes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-2">
              {smartModes.map((mode, index) => (
                <ModeBox
                  key={mode.id}
                  title={mode.title}
                  description={mode.description}
                  gradient={mode.gradient}
                  onClick={() => handleModeSelect(mode.id)}
                  delay={index * 100}
                />
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 glass border-border/50">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">8</div>
                  <div className="text-sm text-muted-foreground">Smart Modes Available</div>
                </div>
              </Card>
              <Card className="p-6 glass border-border/50">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-accent">∞</div>
                  <div className="text-sm text-muted-foreground">Possibilities Ahead</div>
                </div>
              </Card>
              <Card className="p-6 glass border-border/50">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-success">24/7</div>
                  <div className="text-sm text-muted-foreground">Always Available</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'chat' && (
          <ChatInterface selectedMode={selectedMode} />
        )}

        {currentView === 'profile' && (
          <UserProfile />
        )}
      </main>
    </div>
  );
};