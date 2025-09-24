import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  User, 
  Brain,
  Check,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  mode?: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const speakMessage = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 group animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <Avatar className={cn(
        "w-8 h-8 border-2",
        isUser ? "border-primary/50" : "border-accent/50"
      )}>
        <AvatarFallback className={cn(
          "text-xs font-semibold",
          isUser 
            ? "bg-primary/10 text-primary" 
            : "bg-accent/10 text-accent"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[80%] space-y-1",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="font-medium">
            {isUser ? "You" : "OMNIX"}
          </span>
          {message.mode && (
            <Badge variant="outline" className="text-xs px-1 py-0 h-4">
              {message.mode}
            </Badge>
          )}
          <span>{formatTime(message.timestamp)}</span>
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative px-4 py-3 rounded-2xl shadow-sm",
          isUser 
            ? "chat-bubble-user rounded-tr-sm" 
            : "chat-bubble-ai rounded-tl-sm"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={speakMessage}
              className="h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              <Volume2 className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            <div className="flex gap-1 ml-2 border-l pl-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(true)}
                className={cn(
                  "h-6 px-2",
                  liked === true ? "text-success" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(false)}
                className={cn(
                  "h-6 px-2",
                  liked === false ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};