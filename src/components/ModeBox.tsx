import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ModeBoxProps {
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
  delay?: number;
}

export const ModeBox = ({ title, description, gradient, onClick, delay = 0 }: ModeBoxProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "mode-box transform transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      onClick={onClick}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-10 rounded-xl transition-opacity duration-300 group-hover:opacity-20",
        gradient
      )} />
      
      {/* Content */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {/* Hover Indicator */}
        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-px bg-primary rounded-full" />
          <div className="w-1 h-1 bg-primary rounded-full ml-1" />
        </div>
      </div>
      
      {/* Corner Accent */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};