
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../constants";
import { Trade } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getStrategyExplanation = async (userPrompt: string, tradeData?: Trade[]) => {
  try {
    const context = tradeData 
      ? `Current Backtest Results: ${JSON.stringify(tradeData.slice(-5))} (Last 5 trades)`
      : "No trades loaded yet.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTIONS}\n\nContext for current session: ${context}`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my reasoning engine. Please ensure your strategy rules are strictly followed.";
  }
};
