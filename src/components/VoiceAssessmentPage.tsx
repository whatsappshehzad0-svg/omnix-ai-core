import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export const VoiceAssessmentPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setPulseScale(prev => (prev === 1 ? 1.2 : 1));
      }, 800);
      return () => clearInterval(interval);
    } else {
      setPulseScale(1);
    }
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Voice Assistant</h2>
        <p className="text-muted-foreground">Speak naturally, I'm listening</p>
      </div>

      {/* Main Orb Container */}
      <Card className="p-12 glass border border-primary/20 backdrop-blur-xl bg-gradient-secondary relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        
        {/* 3D Holographic Orb */}
        <div className="relative flex items-center justify-center min-h-[300px]">
          {/* Outer rings - energy waves */}
          {isRecording && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-2 border-primary/30 animate-ping" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.3s' }}>
                <div className="w-72 h-72 rounded-full border-2 border-accent/20 animate-ping" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.6s' }}>
                <div className="w-80 h-80 rounded-full border border-primary/10 animate-ping" />
              </div>
            </>
          )}

          {/* Middle glow layers */}
          <div 
            className={cn(
              "absolute w-48 h-48 rounded-full transition-all duration-300",
              "bg-gradient-accent opacity-20 blur-3xl",
              isRecording && "animate-pulse"
            )}
            style={{ transform: `scale(${pulseScale})` }}
          />
          
          {/* Main orb */}
          <div className="relative z-10">
            <div 
              className={cn(
                "w-40 h-40 rounded-full transition-all duration-500",
                "bg-gradient-accent shadow-glow-strong",
                "flex items-center justify-center",
                isRecording && "animate-glow-pulse"
              )}
              style={{ 
                transform: `scale(${pulseScale})`,
                boxShadow: isRecording 
                  ? '0 0 60px hsl(180 100% 50% / 0.6), 0 0 100px hsl(270 100% 65% / 0.4), inset 0 0 40px hsl(180 100% 50% / 0.3)'
                  : '0 0 40px hsl(180 100% 50% / 0.4), 0 0 80px hsl(270 100% 65% / 0.2)'
              }}
            >
              {/* Inner glow */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 backdrop-blur-sm" />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isRecording ? (
                  <Radio className="h-12 w-12 text-background animate-pulse" />
                ) : (
                  <Mic className="h-12 w-12 text-background" />
                )}
              </div>
            </div>
          </div>

          {/* Waveform effect when recording */}
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-16 opacity-60">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-accent rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status text */}
        <div className="relative text-center mt-6">
          <p className={cn(
            "text-sm font-medium transition-colors duration-300",
            isRecording ? "text-primary" : "text-muted-foreground"
          )}>
            {isRecording ? "Listening..." : "Tap microphone to start"}
          </p>
        </div>
      </Card>

      {/* Control Button */}
      <div className="flex justify-center">
        <Button
          onClick={toggleRecording}
          size="lg"
          className={cn(
            "rounded-full w-20 h-20 p-0 transition-all duration-300 border-2",
            isRecording 
              ? "bg-destructive hover:bg-destructive/90 border-destructive shadow-glow-strong" 
              : "bg-gradient-accent hover:opacity-90 border-primary shadow-glow"
          )}
        >
          {isRecording ? (
            <MicOff className="h-8 w-8 text-background" />
          ) : (
            <Mic className="h-8 w-8 text-background" />
          )}
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Response Time", value: "0.8s", color: "primary" },
          { label: "Accuracy", value: "98%", color: "accent" },
          { label: "Languages", value: "100+", color: "success" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 glass border border-border/50 backdrop-blur-xl text-center">
            <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
