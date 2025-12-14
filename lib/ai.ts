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

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export const initAI = () => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing. Make sure VITE_GEMINI_API_KEY is set in your .env file.");
    return;
  }
  genAI = new GoogleGenerativeAI(API_KEY);
  // Using gemini-1.5-pro for better reasoning capabilities
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
};

export const chatWithAI = async (userMessage: string, history: { role: 'user' | 'model', parts: string }[]) => {
  if (!API_KEY) return "Configuration Error: API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.";
  
  if (!model) initAI();
  if (!model) return "I'm currently offline (Model initialization failed).";

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to assist potential ZYXO clients." }]
        },
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.parts }]
        }))
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("AI Chat Error Details:", error);
    
    // Check for common errors
    if (error.message?.includes('API key not valid')) {
      return "Configuration Error: The provided API key is invalid.";
    }
    if (error.message?.includes('PERMISSION_DENIED')) {
      return "Access Denied: The API key does not have permission to access this model.";
    }
    
    return `I apologize, but I'm having trouble connecting to my brain right now. (Error: ${error.message || 'Unknown'})`;
  }
};

