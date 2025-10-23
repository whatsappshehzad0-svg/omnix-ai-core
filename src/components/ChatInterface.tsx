import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Download, 
  Search, 
  Volume2,
  VolumeX,
  Sparkles,
  Zap
} from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatSidebar } from "@/components/ChatSidebar";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { UnifiedInput } from "@/components/UnifiedInput";
import { toast as sonnerToast } from 'sonner';

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
  const [streamingResponse, setStreamingResponse] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);
  
  // Image generation states
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  const { sendStreamingMessage, isStreaming } = useStreamingChat();

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
    setStreamingResponse('');

    // Create placeholder message for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const placeholderMessage: Message = {
      id: aiMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      mode: selectedMode || undefined
    };
    
    setMessages(prev => [...prev, placeholderMessage]);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      if (useStreaming) {
        await sendStreamingMessage(
          currentInput || 'Please analyze this document.',
          conversationHistory,
          selectedMode,
          fileContent,
          {
            onToken: (token) => {
              setStreamingResponse(prev => {
                const newContent = prev + token;
                setMessages(msgs => 
                  msgs.map(m => 
                    m.id === aiMessageId 
                      ? { ...m, content: newContent }
                      : m
                  )
                );
                return newContent;
              });
            },
            onComplete: async (fullResponse) => {
              setIsTyping(false);
              setStreamingResponse('');
              
              if (autoSpeak && fullResponse) {
                try {
                  await speak(fullResponse);
                } catch (voiceError) {
                  console.error('Error playing voice response:', voiceError);
                }
              }
            },
            onError: (error) => {
              throw error;
            }
          }
        );
      } else {
        // Non-streaming fallback
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: {
            message: currentInput || 'Please analyze this document.',
            fileContent,
            conversationHistory,
            mode: selectedMode,
            stream: false
          }
        });

        if (error) {
          throw new Error(error.message || 'Failed to get AI response');
        }

        setMessages(msgs => 
          msgs.map(m => 
            m.id === aiMessageId 
              ? { ...m, content: data.response }
              : m
          )
        );
        
        if (autoSpeak && data.response) {
          try {
            await speak(data.response);
          } catch (voiceError) {
            console.error('Error playing voice response:', voiceError);
          }
        }
        
        setIsTyping(false);
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });

      setMessages(msgs => 
        msgs.map(m => 
          m.id === aiMessageId 
            ? { ...m, content: "I apologize, but I'm having trouble processing your request right now. Please try again." }
            : m
        )
      );
      
      setIsTyping(false);
    }
  };

  const exportConversation = () => {
    const conversationText = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'You' : 'OMNIX'}:\n${m.content}\n`
    ).join('\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnix-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    sonnerToast.success('Conversation exported successfully');
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

  // Image generation handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      sonnerToast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      sonnerToast.success('Image uploaded');
    };
    reader.readAsDataURL(file);
  };

  const handleImageGenerate = async () => {
    if (!imagePrompt.trim()) {
      sonnerToast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: imagePrompt,
          imageUrl: uploadedImage 
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        sonnerToast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      sonnerToast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
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
              {useStreaming && (
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  <Zap className="h-3 w-3 mr-1" />
                  Streaming
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setUseStreaming(!useStreaming)}
                title={useStreaming ? "Disable streaming" : "Enable streaming"}
                className={useStreaming ? "text-accent" : "text-muted-foreground"}
              >
                <Zap className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={exportConversation}
                title="Export conversation"
              >
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
              
              {(isTyping || isStreaming) && (
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-card border border-border/50 animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {isStreaming ? 'OMNIX is responding...' : 'OMNIX is thinking...'}
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </Card>

        {/* Input Area */}
        <Card className="mt-4 p-4 glass border-border/50">
          <UnifiedInput
            chatInput={input}
            setChatInput={setInput}
            onChatSend={sendMessage}
            onChatKeyPress={handleKeyPress}
            isTyping={isTyping}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onFileUpload={handleFileUpload}
            isRecording={isRecording}
            isProcessing={isProcessing}
            toggleVoiceInput={toggleVoiceInput}
            imagePrompt={imagePrompt}
            setImagePrompt={setImagePrompt}
            onImageGenerate={handleImageGenerate}
            isGenerating={isGenerating}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            onImageUpload={handleImageUpload}
          />
          
          {generatedImage && (
            <div className="mt-4 rounded-lg overflow-hidden border">
              <img 
                src={generatedImage} 
                alt={imagePrompt}
                className="w-full h-auto"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};