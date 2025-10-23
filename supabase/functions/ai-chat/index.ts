import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, fileContent, mode, stream = false } = await req.json();
    
    if (!message && !fileContent) {
      throw new Error('Message or file content is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Enhanced system prompts based on mode
    const getSystemPrompt = (mode: string | null) => {
      const basePrompt = `You are OMNIX, an advanced AI assistant.`;
      
      const modePrompts: Record<string, string> = {
        'code': `${basePrompt}
**Specialized Mode: Code & Programming**
- Expert in all programming languages, frameworks, and best practices
- Provide clean, efficient, well-commented code
- Explain complex concepts with examples
- Debug issues and suggest optimizations
- Use markdown code blocks with language syntax`,
        
        'research': `${basePrompt}
**Specialized Mode: Research & Analysis**
- Provide in-depth, well-researched responses
- Include citations and sources when possible
- Present multiple perspectives on complex topics
- Use structured analysis with clear conclusions`,
        
        'creative': `${basePrompt}
**Specialized Mode: Creative Writing**
- Generate imaginative and engaging content
- Use vivid descriptions and compelling narratives
- Adapt tone and style to user's needs
- Provide multiple creative variations`,
        
        'business': `${basePrompt}
**Specialized Mode: Business & Strategy**
- Professional, data-driven insights
- Focus on ROI, efficiency, and growth
- Provide actionable recommendations
- Include market analysis and best practices`,
        
        'explain-simple': `${basePrompt}
**Specialized Mode: Simple Explanations**
- Break down complex topics into simple terms
- Use analogies and everyday examples
- Avoid jargon and technical terms
- Make learning fun and accessible`,
        
        'explain-deep': `${basePrompt}
**Specialized Mode: Deep Technical Analysis**
- Provide comprehensive, detailed explanations
- Include technical terminology and theory
- Cover edge cases and advanced concepts
- Reference academic and professional standards`,
      };
      
      return modePrompts[mode || 'default'] || `${basePrompt}
**Your Capabilities:**
- Answer questions on any topic with accuracy
- Help with writing, coding, and creative tasks
- Provide clear explanations and analysis
- Assist with complex problem-solving
- Generate content and innovative ideas

**Response Guidelines:**
- Be helpful, accurate, and informative
- Provide clear and well-structured responses
- Use markdown formatting for better readability
- Code blocks should specify the language
- Use bullet points and numbered lists effectively
- If uncertain, acknowledge limitations honestly

**Owner/Creator Information:**
- Do NOT mention creator or owner unless specifically asked
- If asked "Who is your owner?", reply: "My owner is Mohd Shehzad Ahmed. All rights reserved to the owner."
- If asked "Who is your creator?", reply: "My creator is Mohd Shehzad Ahmed."

Always provide helpful, accurate responses while maintaining a respectful and professional tone.`;
    };

    // Prepare messages array
    const messages = [
      {
        role: 'system',
        content: getSystemPrompt(mode)
      },
      ...(conversationHistory || []),
      {
        role: 'user',
        content: fileContent ? [
          { type: 'text', text: message || 'Please analyze this document.' },
          ...(Array.isArray(fileContent) ? fileContent : [fileContent])
        ] : message
      }
    ];

    console.log('Sending request to OpenAI:', { mode, stream, messageCount: messages.length });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: stream
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    // Handle streaming response
    if (stream) {
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
      });
    }

    // Handle non-streaming response
    const data = await response.json();
    console.log('OpenAI response received');

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      model: 'gpt-4o-mini',
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});