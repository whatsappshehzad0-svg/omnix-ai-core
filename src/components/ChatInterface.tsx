import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  Mic, 
  MicOff, 
  Download, 
  Search, 
  Volume2,
  VolumeX,
  Loader2,
  Sparkles,
  FileText
} from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatSidebar } from "@/components/ChatSidebar";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

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
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, type: string, content: any}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: Array<{name: string, type: string, content: any}> = [];

    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target?.result as string;
          newFiles.push({
            name: file.name,
            type: 'pdf',
            content: { type: 'text', text: `[PDF Document: ${file.name}]\n\nPlease analyze this document and provide insights in Hindi.` }
          });
          setUploadedFiles(prev => [...prev, ...newFiles]);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          newFiles.push({
            name: file.name,
            type: 'image',
            content: { type: 'image_url', image_url: { url: base64 } }
          });
          setUploadedFiles(prev => [...prev, ...newFiles]);
        };
        reader.readAsDataURL(file);
      }
    }

    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) ready to analyze`,
    });
  };

  const sendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const fileContent = uploadedFiles.length > 0 
      ? uploadedFiles.map(f => f.content)
      : null;

    const displayMessage = uploadedFiles.length > 0
      ? `${input}\n\n📎 Uploaded: ${uploadedFiles.map(f => f.name).join(', ')}`
      : input;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: displayMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setUploadedFiles([]);
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput || 'Please analyze this document.',
          fileContent,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        mode: selectedMode || undefined
      };

      setMessages(prev => [...prev, aiResponse]);
      
      if (autoSpeak && data.response) {
        try {
          await speak(data.response);
        } catch (voiceError) {
          console.error('Error playing voice response:', voiceError);
        }
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
        mode: selectedMode || undefined
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = async () => {
    if (isRecording) {
      try {
        const transcribedText = await stopRecording();
        if (transcribedText) {
          setInput(transcribedText);
        }
      } catch (error: any) {
        toast({
          title: "Voice Error",
          description: error.message || "Failed to process voice input",
          variant: "destructive",
        });
      }
    } else {
      try {
        await startRecording();
      } catch (error: any) {
        toast({
          title: "Microphone Error",
          description: error.message || "Failed to access microphone",
          variant: "destructive",
        });
      }
    }
  };

  const toggleAutoSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setAutoSpeak(!autoSpeak);
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleAutoSpeak}
                className={autoSpeak ? "text-primary" : "text-muted-foreground"}
                title={autoSpeak ? "Disable voice responses" : "Enable voice responses"}
              >
                {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
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
          {uploadedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">{file.name}</span>
                  <button
                    onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Upload PDF or Image"
              className="text-muted-foreground hover:text-primary"
            >
              <FileText className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Upload a document or type your message..."
                className="pr-20 bg-background/50 border-border/50 focus:border-primary/50"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceInput}
                  disabled={isProcessing}
                  className={isRecording ? "text-primary animate-pulse" : "text-muted-foreground"}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isRecording ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={sendMessage}
              disabled={!input.trim() && uploadedFiles.length === 0}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>📎 Upload PDF/images or type your legal query</span>
            <span>{input.length}/2000</span>
          </div>
        </Card>
      </div>
    </div>
  );
};