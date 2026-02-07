
import { GoogleGenAI, Type } from "@google/genai";
import { ChemicalInfo, StorageCategory } from "../types";
import { H_TO_CATEGORY_RULES, CATEGORY_LABELS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchChemicalInfo(cas: string): Promise<ChemicalInfo> {
  const prompt = `Lookup chemical information for CAS number: ${cas}. Provide the official name, common GHS H-statements (hazard statements like H225, H301, etc.), and whether it is considered flammable (可燃) in a storage context. If the CAS is invalid, return an error.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Chemical name in Chinese" },
          hStatements: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of H-statements (e.g. ['H225', 'H314'])"
          },
          isFlammable: { type: Type.BOOLEAN, description: "Is it flammable?" }
        },
        required: ["name", "hStatements", "isFlammable"]
      }
    }
  });

  const data = JSON.parse(response.text);
  
  // Logic to determine Storage Category from H-statements and flammability
  let detectedCategory = StorageCategory.UNKNOWN;
  const hSet = new Set(data.hStatements.map((s: string) => s.toUpperCase().trim()));

  for (const rule of H_TO_CATEGORY_RULES) {
    const hasHCodes = rule.hCodes.some(code => hSet.has(code));
    if (hasHCodes) {
      if (rule.flammable !== undefined) {
        if (rule.flammable === data.isFlammable) {
          detectedCategory = rule.category;
          break;
        }
      } else {
        detectedCategory = rule.category;
        break;
      }
    }
  }

  // Final check: if no category but flammable, default to 3 if it seems likely, 
  // though H-codes are usually primary.
  if (detectedCategory === StorageCategory.UNKNOWN && data.isFlammable) {
      // Look for H224, H225, H226 manually if not caught
      if (hSet.has('H224') || hSet.has('H225') || hSet.has('H226')) detectedCategory = StorageCategory.CAT_3;
  }

  return {
    cas: cas,
    name: data.name,
    hStatements: data.hStatements,
    isFlammable: data.isFlammable,
    category: detectedCategory,
    categoryLabel: CATEGORY_LABELS[detectedCategory]
  };
}
