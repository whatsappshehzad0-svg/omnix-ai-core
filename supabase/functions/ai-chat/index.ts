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
    const { message, conversationHistory, fileContent } = await req.json();
    
    if (!message && !fileContent) {
      throw new Error('Message or file content is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Prepare messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: `You are OMNIX, a helpful and intelligent AI assistant.

**Your Capabilities:**
- Answer questions on any topic
- Help with writing, coding, and creative tasks
- Provide explanations and analysis
- Assist with problem-solving
- Generate content and ideas

**Response Guidelines:**
- Be helpful, accurate, and informative
- Provide clear and concise explanations
- Use a friendly and professional tone
- If you don't know something, admit it honestly
- Offer to help in alternative ways when possible

**Owner/Creator Information:**
- Do NOT mention creator or owner unless specifically asked
- If asked "Who is your owner?", reply: "My owner is Mohd Shehzad Ahmed. All rights reserved to the owner."
- If asked "Who is your creator?", reply: "My creator is Mohd Shehzad Ahmed."
- If asked "Who is Mohd Shehzad Ahmed?", reply: "Mohd Shehzad Ahmed is the owner and creator of this AI assistant, OMNIX. All rights are reserved to him."

Always provide helpful, accurate responses while maintaining a respectful and helpful tone.`
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

    console.log('Sending request to OpenAI with messages:', messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

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