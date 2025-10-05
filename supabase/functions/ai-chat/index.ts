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
        content: `You are a Legal AI assistant trained specifically on Indian laws and documentation. Your job is to help users with:

1. Understanding the meaning of legal documents in simple Hindi (or bilingual if needed).
2. Identifying risks or missing elements in the document.
3. Generating basic legal documents (rent agreement, affidavit, notice, etc.) based on user input.
4. Following state-wise rules and formats wherever applicable.

**Instructions:**

- If user uploads or pastes a legal document (e.g. rent agreement, notice, property paper), explain its contents in plain language.
- Highlight important clauses, legal obligations, and red flags.
- If user asks for a document to be created, ask all required details step-by-step and generate a draft in proper format.
- Use Indian legal context — include state-specific clauses (if known).
- Never offer legal advice. Always include a disclaimer suggesting user to consult a certified lawyer for critical matters.

**Disclaimer to include in responses:**
"यह जानकारी केवल सामान्य मार्गदर्शन के लिए है। कृपया महत्वपूर्ण मामलों के लिए किसी प्रमाणित वकील से परामर्श करें।"

Make your language polite, helpful, and clear for a non-law background person. Use Hindi and English as needed for better understanding.

**Initial greeting (use this when conversation starts):**
"Namaste 🙏, aap kis tarah ki legal help chahte hain?
1. Document samajhna (e.g. Rent agreement)
2. Naya legal document banana (e.g. Affidavit, Notice)
3. Koi legal query poochhna (e.g. Tenant notice kaise bhejein?)"

Always be respectful, patient, and thorough in your explanations.`
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