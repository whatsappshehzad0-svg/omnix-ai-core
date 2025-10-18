import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Eye, EyeOff, Shield, Zap } from "lucide-react";

interface AuthFormProps {
  onLogin: () => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-glow opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-accent opacity-10 blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md space-y-6 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-strong">
              <Sparkles className="h-8 w-8 text-background" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Omnix AI
            </h1>
            <p className="text-muted-foreground">Futuristic Intelligence</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="p-6 glass border border-primary/20 backdrop-blur-xl bg-gradient-secondary">
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-accent hover:opacity-90 text-background font-semibold shadow-glow border-0"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Logging in...
                    </div>
                  ) : (
                    "Login to Omnix AI"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-accent hover:opacity-90 text-background font-semibold shadow-glow border-0"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Omnix Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-primary/10 w-fit mx-auto">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">AI Powered</p>
          </div>
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-accent/10 w-fit mx-auto">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-success/10 w-fit mx-auto border border-success/20">
              <Sparkles className="h-5 w-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Smart</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Owner: Mohd Shehzad Ahmed</p>
          <p className="mt-1">All rights reserved to the owner.</p>
        </div>
      </div>
    </div>
  );
};