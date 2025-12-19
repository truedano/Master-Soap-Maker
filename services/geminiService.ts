
import { GoogleGenAI } from "@google/genai";

export async function askGemini(prompt: string) {
  // Fix: Strictly use process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `
          你是一位專業的手工皂製作大師。請回答使用者的問題。
          你的回答應基於冷製皂(CP Soap)的專業知識，包含安全規範、油脂比例、INS值計算與問題排除。
          請保持專業、親切且實用的風格。如果使用者問及危險操作，務必給予強烈警告。
        `,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，我暫時無法回答您的問題。請稍後再試。";
  }
}
