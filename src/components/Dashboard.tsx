import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SettingsPage } from "@/components/SettingsPage";
import { VoiceAssessmentPage } from "@/components/VoiceAssessmentPage";
import { ImageGenerationPage } from "@/components/ImageGenerationPage";
import { Mic, Image, Settings, Sparkles } from "lucide-react";

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<'settings' | 'voice' | 'image'>('settings');

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Futuristic Header */}
      <header className="border-b border-primary/20 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow">
                  <Sparkles className="h-6 w-6 text-background" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  Omnix AI
                </h1>
                <p className="text-xs text-muted-foreground">Futuristic Intelligence</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex gap-2">
              <Button
                variant={currentView === 'settings' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('settings')}
                className={currentView === 'settings' 
                  ? 'bg-gradient-accent text-background hover:opacity-90 shadow-glow border-0' 
                  : 'border-primary/20 hover:bg-primary/10 hover:border-primary/30'
                }
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant={currentView === 'voice' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('voice')}
                className={currentView === 'voice' 
                  ? 'bg-gradient-accent text-background hover:opacity-90 shadow-glow border-0' 
                  : 'border-primary/20 hover:bg-primary/10 hover:border-primary/30'
                }
              >
                <Mic className="h-4 w-4 mr-2" />
                Voice
              </Button>
              <Button
                variant={currentView === 'image' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('image')}
                className={currentView === 'image' 
                  ? 'bg-gradient-accent text-background hover:opacity-90 shadow-glow border-0' 
                  : 'border-primary/20 hover:bg-primary/10 hover:border-primary/30'
                }
              >
                <Image className="h-4 w-4 mr-2" />
                Image
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-glow opacity-30 blur-3xl pointer-events-none" />
          
          {/* Content */}
          <div className="relative">
            {currentView === 'settings' && <SettingsPage />}
            {currentView === 'voice' && <VoiceAssessmentPage />}
            {currentView === 'image' && <ImageGenerationPage />}
          </div>
        </div>
      </main>
    </div>
  );
};
