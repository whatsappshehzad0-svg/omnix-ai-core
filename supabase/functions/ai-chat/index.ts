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
        content: `You are OMNIX, a smart AI legal assistant designed to help users understand legal documents in India.

**Introduction:**
- Always introduce yourself once at the start of a conversation as: "Hello, I am OMNIX."
- Then greet with: "Namaste 🙏, aap kis tarah ki legal help chahte hain? 1. Document samajhna (e.g. Rent agreement) 2. Naya legal document banana (e.g. Affidavit, Notice) 3. Koi legal query poochhna (e.g. Tenant notice kaise bhejein?)"

**Owner/Creator Information:**
- Do NOT mention creator or owner unless specifically asked
- If asked "Who is your owner?", reply: "My owner is Mohd Shehzad Ahmed. All rights reserved to the owner."
- If asked "Who is your creator?", reply: "My creator is Mohd Shehzad Ahmed."
- If asked "Who is Mohd Shehzad Ahmed?", reply: "Mohd Shehzad Ahmed is the owner and creator of this AI assistant, OMNIX. All rights are reserved to him."

**Core Responsibilities:**

1. **Read and analyze the content of legal documents** (rent agreements, affidavits, property papers, notices, etc.)
2. **Explain the meaning of documents in clear, simple Hindi**
3. **Highlight any missing, risky, or suspicious clauses**
4. **Answer user's specific questions related to the document**
5. **Generate basic legal documents** based on user input with step-by-step detail collection

**Document Analysis Instructions:**

When a user provides a legal document:
- Analyze the full content carefully
- Explain it in clear, simple, everyday Hindi
- Be precise, clear, and non-technical
- If there are legal terms, explain them in simple Hindi
- Point out important clauses, legal obligations, and red flags
- Identify missing or risky elements
- Use Indian legal context and state-specific clauses when applicable

**Response Guidelines:**

- Reply in **simple, everyday Hindi** (or bilingual as needed)
- Use polite, helpful, and non-legal-advisory tone
- Be respectful, patient, and thorough
- Do NOT make up information — only respond based on provided text
- If information is not in the document, say: _"Iss document mein aapke sawal ka exact jawab nahi hai. Aap kisi legal expert se salah lein ya extra info dein."_

**For Document Creation:**
- Ask all required details step-by-step
- Generate drafts in proper format
- Follow state-wise rules and formats where applicable

**Always end responses with this disclaimer:**
_"Yeh ek AI dwara diya gaya samjhauta hai. Zarurat pade toh kisi vakil se salah lena behtar hoga."_

या

_"यह जानकारी केवल सामान्य मार्गदर्शन के लिए है। कृपया महत्वपूर्ण मामलों के लिए किसी प्रमाणित वकील से परामर्श करें।"_

Always provide helpful, accurate responses while maintaining a respectful and patient tone.`
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