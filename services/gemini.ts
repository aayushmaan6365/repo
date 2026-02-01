
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFloodRisk(cityName: string, forecast: any[], language: string) {
  try {
    const langName = language === 'hi' ? 'Hindi' : 'English';
    const prompt = `Task: Analyze the flood risk for ${cityName} based on the provided 7-day weather forecast: ${JSON.stringify(forecast)}.
    
    Output Requirements:
    - Provide a concise risk assessment (3-4 sentences).
    - Mention potential impact (e.g., waterlogging, transport disruption) and specific precautions.
    - Style: Professional, data-driven, and reassuring.
    - LANGUAGE: You MUST write the ENTIRE response in ${langName}. DO NOT use any English words if the language is Hindi, and vice-versa.
    - NO TRANSLITERATION: Use the native script of the requested language.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || (language === 'hi' ? "इस समय विश्लेषण उपलब्ध नहीं है।" : "Unable to generate analysis at this time.");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return language === 'hi' 
      ? "AI विश्लेषण प्राप्त करने में त्रुटि। कृपया अपना नेटवर्क कनेक्शन जांचें।" 
      : "Error fetching AI analysis. Please check your network connection.";
  }
}
