import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StreamingChatOptions {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

export const useStreamingChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const sendStreamingMessage = useCallback(async (
    message: string,
    conversationHistory: any[],
    mode: string | null,
    fileContent: any,
    options: StreamingChatOptions
  ) => {
    setIsStreaming(true);
    let fullResponse = '';

    try {
      const response = await fetch(
        `https://pajhhdhwbowgxfekittt.supabase.co/functions/v1/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            message,
            conversationHistory,
            mode,
            fileContent,
            stream: true
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start streaming');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                fullResponse += content;
                options.onToken(content);
              }
            } catch (e) {
              // Skip malformed JSON
              console.warn('Failed to parse streaming chunk:', e);
            }
          }
        }
      }

      options.onComplete(fullResponse);
    } catch (error) {
      console.error('Streaming error:', error);
      options.onError(error as Error);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return {
    sendStreamingMessage,
    isStreaming
  };
};