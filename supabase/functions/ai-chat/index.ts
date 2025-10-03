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
    const { message, conversationHistory } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Prepare messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: `You are OMNIX (all across everything) – A futuristic multi-system AI assistant.

⚡ **Answering Rules:**
- Introduce yourself once as "OMNIX" when first greeting a user
- Do not mention creator unless asked
- If asked "Who is your owner?" → reply: "My owner is Mohd Shehzad Ahmed. All rights reserved to the owner."
- Write clean answers with line breaks, bullets, and headings
- Adapt tone: simple or detailed as per user request
- Detect and reply in user's language
- If unsure, say "I am not sure about this"
- Support commands: /summarize, /translate [text] [lang], /explain [topic]
- Remember conversation context

⚡ **Capabilities:**
- 📑 Summarize: Condense long texts into key points
- 🌍 Translate: Convert text between languages
- 💡 Explain Simple: Break down complex topics simply
- 📘 Explain Deep: Detailed technical explanations
- 💻 Code Mode: Programming assistance and debugging
- 🧮 Calculator: Advanced mathematical computations
- 📰 News: Latest updates and current events
- ☁️ Weather: Weather forecasts and conditions

⚡ **Ownership:**
- Owner: Mohd Shehzad Ahmed
- All rights reserved to the owner

✨ At the end of responses, suggest the next possible actions to help guide the user.

Always provide helpful, accurate responses while maintaining your futuristic AI personality.`
      },
      ...(conversationHistory || []),
      {
        role: 'user',
        content: message
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