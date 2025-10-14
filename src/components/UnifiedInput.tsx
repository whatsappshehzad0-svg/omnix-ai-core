import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Send, 
  Mic, 
  MicOff, 
  Loader2,
  FileText,
  ImagePlus,
  Upload,
  X
} from 'lucide-react';

interface UnifiedInputProps {
  chatInput: string;
  setChatInput: (value: string) => void;
  onChatSend: () => void;
  onChatKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  uploadedFiles: Array<{name: string, type: string, content: any}>;
  setUploadedFiles: (files: any) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRecording: boolean;
  isProcessing: boolean;
  toggleVoiceInput: () => void;
  // Image generation props
  imagePrompt: string;
  setImagePrompt: (value: string) => void;
  onImageGenerate: () => void;
  isGenerating: boolean;
  uploadedImage: string | null;
  setUploadedImage: (value: string | null) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UnifiedInput = ({
  chatInput,
  setChatInput,
  onChatSend,
  onChatKeyPress,
  isTyping,
  uploadedFiles,
  setUploadedFiles,
  onFileUpload,
  isRecording,
  isProcessing,
  toggleVoiceInput,
  imagePrompt,
  setImagePrompt,
  onImageGenerate,
  isGenerating,
  uploadedImage,
  setUploadedImage,
  onImageUpload,
}: UnifiedInputProps) => {
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="chat" className="gap-2">
          <Send className="h-4 w-4" />
          Chat
        </TabsTrigger>
        <TabsTrigger value="image" className="gap-2">
          <ImagePlus className="h-4 w-4" />
          Generate Image
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="mt-0 space-y-3">
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">{file.name}</span>
                <button
                  onClick={() => setUploadedFiles((prev: any[]) => prev.filter((_, i) => i !== idx))}
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
            ref={chatFileInputRef}
            type="file"
            accept=".pdf,image/*"
            multiple
            onChange={onFileUpload}
            className="hidden"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => chatFileInputRef.current?.click()}
            title="Upload PDF or Image"
            className="text-muted-foreground hover:text-primary"
          >
            <FileText className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={onChatKeyPress}
              placeholder="Type your message or upload files..."
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
            onClick={onChatSend}
            disabled={(!chatInput.trim() && uploadedFiles.length === 0) || isTyping}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>📎 Upload PDF/images or type your query</span>
          <span>{chatInput.length}/2000</span>
        </div>
      </TabsContent>

      <TabsContent value="image" className="mt-0 space-y-3">
        {uploadedImage && (
          <div className="relative rounded-lg overflow-hidden border p-2">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4 h-6 w-6"
              onClick={() => setUploadedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img 
              src={uploadedImage} 
              alt="Uploaded"
              className="w-full h-auto max-h-48 object-contain"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Describe the image you want to generate..."
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onImageGenerate()}
            disabled={isGenerating}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
          <input
            ref={imageFileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => imageFileInputRef.current?.click()}
            disabled={isGenerating}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button 
            onClick={onImageGenerate} 
            disabled={isGenerating || !imagePrompt.trim()}
            className="gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 Upload an image to edit or describe your vision to generate new images
        </div>
      </TabsContent>
    </Tabs>
  );
};
