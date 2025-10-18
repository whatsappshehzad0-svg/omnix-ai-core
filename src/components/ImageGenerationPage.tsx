import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Sparkles, Upload, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ImageGenerationPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      toast.success('Image uploaded');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt,
          imageUrl: uploadedImage 
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Image Generator
        </h2>
        <p className="text-muted-foreground">Transform your ideas into stunning visuals</p>
      </div>

      {/* Input Section */}
      <Card className="p-6 glass border border-primary/20 backdrop-blur-xl bg-gradient-secondary space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            Describe your image
          </label>
          <Input
            placeholder="A futuristic city with neon lights, cyberpunk style..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={isGenerating}
            className="bg-background/50 border-border/50 focus:border-primary/50 h-12"
          />
        </div>

        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className="flex-1 border-border/50 hover:border-primary/30 hover:bg-primary/5"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Reference
          </Button>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className={cn(
              "flex-1 bg-gradient-accent hover:opacity-90 text-background font-semibold border-0",
              isGenerating ? "animate-pulse" : "shadow-glow"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Magic...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Image Display */}
      {(generatedImage || uploadedImage) && (
        <Card className="p-6 glass border border-primary/20 backdrop-blur-xl bg-gradient-secondary space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {generatedImage ? 'Generated Image' : 'Reference Image'}
          </h3>
          
          <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 shadow-glow-strong bg-background/30">
            {/* Glow effect wrapper */}
            <div className="absolute inset-0 bg-gradient-accent opacity-5" />
            
            <img 
              src={generatedImage || uploadedImage || ''} 
              alt={generatedImage ? prompt : "Reference"}
              className="w-full h-auto relative z-10"
              style={{
                filter: 'drop-shadow(0 0 20px hsl(180 100% 50% / 0.3))'
              }}
            />
            
            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 to-transparent z-20" />
          </div>

          {generatedImage && (
            <p className="text-sm text-muted-foreground italic">
              "{prompt}"
            </p>
          )}
        </Card>
      )}

      {/* Placeholder when no image */}
      {!generatedImage && !uploadedImage && (
        <Card className="p-12 glass border border-dashed border-border/50 backdrop-blur-xl bg-gradient-secondary">
          <div className="text-center space-y-4 opacity-50">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-accent/10 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary/50" />
              </div>
            </div>
            <p className="text-muted-foreground">Your AI-generated masterpiece will appear here</p>
          </div>
        </Card>
      )}
    </div>
  );
};
