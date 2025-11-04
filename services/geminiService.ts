import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import `ActionType` enum as it is used as a value for comparison.
import { ActionType, type ActionStep, type GeminiAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    risks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of potential risks like slippage, contract vulnerabilities, or market volatility."
    },
    optimizations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of suggestions to improve the strategy, e.g., alternative routing or different assets."
    },
    estimatedProfitUSD: {
        type: Type.NUMBER,
        description: "A numerical estimation of the potential profit in USD. Can be negative for a loss."
    }
  },
  required: ["risks", "optimizations", "estimatedProfitUSD"],
};

function formatStrategyForPrompt(steps: ActionStep[]): string {
  if (steps.length === 0) {
    return "The user has not defined any steps for the flash loan strategy.";
  }

  const formattedSteps = steps.map((step, index) => {
    const { type, chain, protocol, params } = step;
    let description = `${index + 1}. ${type} on ${protocol.name} (${chain.name}): `;
    if (type === ActionType.SWAP) {
      description += `Swap ${params.amount.toLocaleString()} ${params.tokenA.symbol} for ${params.tokenB?.symbol}.`;
    } else if (type === ActionType.BORROW) {
      description += `Borrow ${params.amount.toLocaleString()} ${params.tokenA.symbol}.`;
    } else if (type === ActionType.REPAY) {
      description += `Repay loan of ${params.tokenA.symbol}.`;
    }
    return description;
  }).join('\n');

  return `
    Analyze the following DeFi flash loan strategy which is executed atomically in a single transaction.
    The goal is to find an arbitrage opportunity that results in a net profit after all fees.

    Strategy Steps:
    ${formattedSteps}

    Based on this sequence, provide a detailed risk analysis, potential optimizations, and an estimated profit in USD.
    Consider factors like cross-chain latency (even though this is atomic, note the complexity), DEX liquidity, potential slippage, and gas fees.
    Assume the initial borrow step sets the principal to be repaid in the final step.
  `;
}

export const analyzeStrategy = async (steps: ActionStep[]): Promise<GeminiAnalysis> => {
  if (!API_KEY) {
    return {
      risks: ["API Key not configured. Analysis is unavailable."],
      optimizations: [],
      estimatedProfitUSD: 0
    };
  }

  try {
    const prompt = formatStrategyForPrompt(steps);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as GeminiAnalysis;

  } catch (error) {
    console.error("Error analyzing strategy with Gemini:", error);
    throw new Error("Failed to get analysis from AI. The model may be overloaded or the request is invalid.");
  }
};