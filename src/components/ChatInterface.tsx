import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Download, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatSidebar } from "@/components/ChatSidebar";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  mode?: string;
}

interface ChatInterfaceProps {
  selectedMode: string | null;
}

export const ChatInterface = ({ selectedMode }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedMode) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `OMNIX ${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} mode activated. How can I assist you today?`,
        role: 'assistant',
        timestamp: new Date(),
        mode: selectedMode
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(input, selectedMode),
        role: 'assistant',
        timestamp: new Date(),
        mode: selectedMode || undefined
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, mode: string | null): string => {
    const responses = {
      summarize: `Here's a concise summary of your request: "${userInput}". I've identified the key points and condensed them for better understanding.`,
      translate: `Translation complete. I've processed your text and can translate it to any language you specify.`,
      'explain-simple': `Let me explain this in simple terms: ${userInput}. Think of it as...`,
      'explain-deep': `Here's a detailed technical explanation: ${userInput} involves multiple layers of complexity...`,
      code: `// Code solution for: ${userInput}\nfunction solution() {\n  // Implementation here\n  return result;\n}`,
      calculator: `Calculating: ${userInput}\nResult: Processing mathematical operation...`,
      news: `Latest news update regarding: ${userInput}. Here's what's happening...`,
      weather: `Weather information for: ${userInput}. Current conditions and forecast...`,
      default: `I understand you're asking about: "${userInput}". Let me provide you with a comprehensive response based on my knowledge across all domains.`
    };

    return responses[mode as keyof typeof responses] || responses.default;
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition implementation would go here
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6 animate-fade-in">
      {/* Chat Sidebar */}
      <ChatSidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <Card className="p-4 mb-4 glass border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <div>
                <h3 className="font-semibold text-foreground">
                  OMNIX Chat {selectedMode && `- ${selectedMode.replace('-', ' ').toUpperCase()}`}
                </h3>
                <p className="text-sm text-muted-foreground">Real-time AI assistance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedMode && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {selectedMode.replace('-', ' ')}
                </Badge>
              )}
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages Area */}
        <Card className="flex-1 glass border-border/50 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-card border border-border/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">OMNIX is thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </Card>

        {/* Input Area */}
        <Card className="mt-4 p-4 glass border-border/50">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask OMNIX anything..."
                className="pr-20 bg-background/50 border-border/50 focus:border-primary/50"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceInput}
                  className={isListening ? "text-primary" : "text-muted-foreground"}
                >
                  {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{input.length}/2000</span>
          </div>
        </Card>
      </div>
    </div>
  );
};