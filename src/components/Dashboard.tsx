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
      id: 'code',
      title: '💻 Code Expert',
      description: 'Programming, debugging & best practices',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'research',
      title: '🔬 Research Pro',
      description: 'In-depth analysis & research',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'creative',
      title: '✨ Creative Writer',
      description: 'Stories, poems & creative content',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'business',
      title: '💼 Business Advisor',
      description: 'Strategy, analysis & ROI insights',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'explain-simple',
      title: '💡 Simple Explainer',
      description: 'Break down complex topics',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'explain-deep',
      title: '📘 Deep Dive',
      description: 'Technical & detailed analysis',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'translate',
      title: '🌍 Translator',
      description: 'Multi-language translation',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'summarize',
      title: '📑 Summarizer',
      description: 'Condense long texts efficiently',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'calculator',
      title: '🧮 Math Solver',
      description: 'Complex calculations & equations',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      id: 'tutor',
      title: '📚 Personal Tutor',
      description: 'Learn any subject step-by-step',
      gradient: 'from-lime-500 to-green-500'
    },
    {
      id: 'consultant',
      title: '🎯 AI Consultant',
      description: 'Expert advice & recommendations',
      gradient: 'from-amber-500 to-yellow-500'
    },
    {
      id: 'assistant',
      title: '🤖 General Assistant',
      description: 'All-purpose AI helper',
      gradient: 'from-slate-500 to-gray-500'
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
              <Card className="p-6 glass border-border/50 hover:scale-105 transition-transform">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Specialized AI Modes</div>
                </div>
              </Card>
              <Card className="p-6 glass border-border/50 hover:scale-105 transition-transform">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-accent">∞</div>
                  <div className="text-sm text-muted-foreground">Unlimited Possibilities</div>
                </div>
              </Card>
              <Card className="p-6 glass border-border/50 hover:scale-105 transition-transform">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-success">24/7</div>
                  <div className="text-sm text-muted-foreground">Always Ready to Help</div>
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