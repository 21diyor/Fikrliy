
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables
// Always use named parameters for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches an educational hint from Gemini for a given algebra question.
 */
export const getGeminiHint = async (question: string, context: string): Promise<string> => {
  try {
    // Call generateContent directly with model name and contents.
    // Persona and core instructions moved to systemInstruction for improved reliability.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Foydalanuvchiga quyidagi savol uchun yordam bering: "${question}". Mavzu: ${context}.`,
      config: {
        systemInstruction: "Siz Fikrliy ilovasida algebra o'qituvchisiz. Foydalanuvchiga algebra savollarida yordam berasiz. Javobni darrov aytmang, balki o'ylashga yo'naltiring. Faqat O'zbek tilida javob bering. Do'stona va rag'batlantiruvchi bo'ling.",
      }
    });
    // Use .text property to get the generated content (not a method)
    return response.text || "Kechirasiz, hozirda yordam bera olmayman.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";
  }
};