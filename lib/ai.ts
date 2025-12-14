import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONTENT } from './content';

// System prompt that gives the AI context about ZYXO
export const SYSTEM_PROMPT = `
You are the AI assistant for ZYXO Digital Solutions.
Your goal is to help potential clients understand our services and choose the right plan.

Key Information about ZYXO:
- Name: ${CONTENT.brand.name}
- Tagline: ${CONTENT.brand.tagline}
- Contact: ${CONTENT.brand.contact.email}

Services & Capabilities:
${CONTENT.systemSpecs.modules.map(m => `- ${m.title}: ${m.desc}`).join('\n')}

Pricing Plans:
${CONTENT.pricing.packages.map(p => `
- ${p.name} Plan (${p.currency}${p.price} ${p.suffix}):
  - ${p.desc}
  - Timeline: ${p.timeline}
  - Key Features: ${p.features.join(', ')}
`).join('\n')}

Important Details:
${CONTENT.risks.items.map(i => `- ${i}`).join('\n')}

Guidelines:
1. Be professional, concise, and helpful.
2. If asked about pricing, always mention the two plans: Starter and Business.
3. If the user wants to buy or get started, encourage them to click the WhatsApp button or "Select Plan" buttons.
4. Keep answers short (under 3 sentences) as you are a chat widget.
5. Do not hallucinate features not listed above.
6. The "Business" plan includes AI Chat Agents (like you!), while the "Starter" plan does not.
`.trim();

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);

export const initAI = () => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing. Make sure VITE_GEMINI_API_KEY is set in your .env file.");
    return false;
  }
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Using latest gemini-2.0-flash model
    model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });
    return true;
  } catch (err) {
    console.error("Failed to initialize Gemini:", err);
    return false;
  }
};

export const chatWithAI = async (userMessage: string, history: { role: 'user' | 'model', parts: string }[]) => {
  if (!API_KEY) {
    return "Configuration Error: API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.";
  }
  
  if (!model) {
    const initialized = initAI();
    if (!initialized || !model) {
      return "I'm currently offline. Please contact us via WhatsApp.";
    }
  }

  try {
    // Build conversation history for context
    const chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.parts }]
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      return "I received an empty response. Please try again.";
    }
    
    return text;
  } catch (error: any) {
    console.error("AI Chat Error Details:", error);
    
    // Provide specific error messages
    const errorMsg = error?.message || error?.toString() || 'Unknown error';
    
    if (errorMsg.includes('API key not valid') || errorMsg.includes('API_KEY_INVALID')) {
      return "Configuration Error: The API key is invalid. Please check your settings.";
    }
    if (errorMsg.includes('PERMISSION_DENIED')) {
      return "Access Denied: The API key doesn't have permission for this model.";
    }
    if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      return "The AI service is temporarily busy. Please try again in a moment.";
    }
    if (errorMsg.includes('not found') || errorMsg.includes('NOT_FOUND')) {
      return "Model not available. Please try again later.";
    }
    
    return `Sorry, I encountered an error: ${errorMsg.substring(0, 100)}`;
  }
};
