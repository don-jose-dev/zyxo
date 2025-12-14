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
    
    // Try using Gemini 3 first
    try {
      model = genAI.getGenerativeModel({ 
        model: "gemini-3-pro-latest",
        systemInstruction: SYSTEM_PROMPT,
      });
    } catch (e) {
      console.warn("Gemini 3 not available, trying fallback models", e);
      
      // Fallback to stable models
      try {
        model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash", // Try 2.0 Flash next
          systemInstruction: SYSTEM_PROMPT,
        });
      } catch (e2) {
        console.warn("Gemini 2.0 Flash not available, using gemini-pro", e2);
        // Final fallback to widely supported gemini-pro
        model = genAI.getGenerativeModel({ 
          model: "gemini-pro",
          systemInstruction: SYSTEM_PROMPT,
        });
      }
    }
    
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
    // Filter to ensure history starts with 'user' role (Gemini requirement)
    let chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.parts }]
    }));

    // If history starts with 'model', remove it (shouldn't happen but safety check)
    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory = chatHistory.slice(1);
    }

    // Only pass history if it's not empty and starts with user
    const chat = model.startChat(
      chatHistory.length > 0 && chatHistory[0].role === 'user'
        ? { history: chatHistory }
        : {}
    );

    // Add timeout to prevent hanging requests (30 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
    });

    const result = await Promise.race([
      chat.sendMessage(userMessage),
      timeoutPromise
    ]) as any;
    
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
    const errorString = JSON.stringify(error, null, 2);
    
    // Check for network/fetch errors
    if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
      return "Network Error: Unable to connect to the AI service. Please check your internet connection and try again.";
    }
    
    if (errorMsg.includes('API key not valid') || errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('401')) {
      return "Configuration Error: The API key is invalid. Please check your settings.";
    }
    if (errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('403')) {
      return "Access Denied: The API key doesn't have permission for this model.";
    }
    if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('429') || errorMsg.includes('Too Many Requests')) {
      return "I'm getting a lot of questions right now! Please wait 30 seconds and try again. 💬";
    }
    if (errorMsg.includes('not found') || errorMsg.includes('NOT_FOUND') || errorMsg.includes('404') || errorMsg.includes('v1beta/mod')) {
      return "Model not available. The AI service is temporarily unavailable. Please try again later or contact us via WhatsApp.";
    }
    if (errorMsg.includes('timeout') || errorMsg.includes('TIMEOUT')) {
      return "Request timed out. The AI service took too long to respond. Please try again.";
    }
    
    // Generic error - show a user-friendly message instead of technical details
    return "I'm having trouble connecting right now. Please try again in a moment, or contact us directly via WhatsApp for immediate assistance.";
  }
};
