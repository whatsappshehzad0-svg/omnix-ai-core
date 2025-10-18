import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Mic, 
  Image, 
  Zap, 
  Shield, 
  Moon, 
  Bell,
  Globe,
  Crown,
  Sparkles
} from "lucide-react";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  premium?: boolean;
}

export const SettingsPage = () => {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 'voice',
      name: 'Voice Assistant',
      description: 'AI voice interactions',
      icon: Mic,
      enabled: true,
    },
    {
      id: 'image-gen',
      name: 'Image Generation',
      description: 'Create AI images',
      icon: Image,
      enabled: true,
    },
    {
      id: 'quick-reply',
      name: 'Quick Responses',
      description: 'Instant AI replies',
      icon: Zap,
      enabled: false,
    },
    {
      id: 'privacy',
      name: 'Enhanced Privacy',
      description: 'Advanced data protection',
      icon: Shield,
      enabled: true,
      premium: true,
    },
    {
      id: 'dark-mode',
      name: 'Adaptive Theme',
      description: 'Auto dark/light mode',
      icon: Moon,
      enabled: true,
    },
    {
      id: 'notifications',
      name: 'Smart Alerts',
      description: 'Context-aware notifications',
      icon: Bell,
      enabled: false,
    },
    {
      id: 'multi-lang',
      name: 'Multi-Language',
      description: '100+ languages supported',
      icon: Globe,
      enabled: true,
      premium: true,
    },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(prev => 
      prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8 animate-fade-in">
      {/* Premium Section */}
      <Card className="p-6 glass border border-primary/20 bg-gradient-secondary backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-5" />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-accent">
                <Crown className="h-6 w-6 text-background" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Get More Features
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </h3>
                <p className="text-sm text-muted-foreground">Unlock premium capabilities</p>
              </div>
            </div>
            <Badge className="bg-gradient-accent text-background border-0 px-4 py-1">
              Premium
            </Badge>
          </div>
          <Button className="w-full bg-gradient-accent hover:opacity-90 text-background font-semibold shadow-glow-strong border-0">
            Upgrade Now
          </Button>
        </div>
      </Card>

      {/* Settings Header */}
      <div className="flex items-center gap-3 px-1">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Features & Settings</h2>
      </div>

      {/* Features List */}
      <div className="space-y-3">
        {features.map((feature, index) => (
          <Card 
            key={feature.id}
            className="p-5 glass border border-border/50 hover:border-primary/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Neon edge glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 rounded-lg" 
                   style={{ 
                     background: 'linear-gradient(135deg, transparent, hsl(180 100% 50% / 0.1), transparent)',
                     boxShadow: 'inset 0 0 20px hsl(180 100% 50% / 0.2)'
                   }} 
              />
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  feature.enabled 
                    ? 'bg-gradient-accent shadow-glow' 
                    : 'bg-muted'
                }`}>
                  <feature.icon className={`h-5 w-5 ${
                    feature.enabled ? 'text-background' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{feature.name}</h3>
                    {feature.premium && (
                      <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              
              <Switch 
                checked={feature.enabled}
                onCheckedChange={() => toggleFeature(feature.id)}
                className="data-[state=checked]:bg-gradient-accent shadow-neon"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
