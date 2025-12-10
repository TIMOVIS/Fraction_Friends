import { GoogleGenAI, Type } from "@google/genai";
import { Fraction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

// --- Offline Fallback Data ---

const FALLBACK_EXPLANATIONS = [
  "Fractions are like sharing a pizza! 🍕 The bottom number is how many slices total, and the top number is how many you eat.",
  "Imagine a chocolate bar! 🍫 If you break it into pieces, each piece is a fraction of the whole bar.",
  "Think of Lego bricks! 🧱 If you have a tower of 4 bricks and take 1 off, you took 1/4 of the tower.",
  "Simplifying is like tidying up! 🧹 We make the numbers smaller, but the amount of cake stays exactly the same."
];

const FALLBACK_PROBLEMS = [
  {
    story: "A hungry dragon 🐉 found a giant cherry pie. He ate some for breakfast and some for lunch.",
    question: "How much pie did the dragon eat in total?",
    n1: 1, d1: 4, n2: 2, d2: 4, op: 'add'
  },
  {
    story: "Two aliens 👽 are painting a spaceship. Zorg paints a small part red, and Blip paints another part blue.",
    question: "What fraction of the spaceship is painted now?",
    n1: 2, d1: 6, n2: 3, d2: 6, op: 'add'
  },
  {
    story: "A wizard 🧙‍♂️ is mixing a potion. He adds some frog slime and then adds some bat wings.",
    question: "How full is the potion cauldron now?",
    n1: 3, d1: 8, n2: 4, d2: 8, op: 'add'
  }
];

// --- API Functions ---

export const getExplanation = async (topic: string, fraction?: Fraction): Promise<string> => {
  // Check online status
  if (!navigator.onLine) {
    return FALLBACK_EXPLANATIONS[Math.floor(Math.random() * FALLBACK_EXPLANATIONS.length)] + " (Offline Mode 📡)";
  }

  try {
    const prompt = `
      You are a friendly, encouraging primary school teacher (Year 3/4 UK).
      Explain the concept of "${topic}" ${fraction ? `specifically for the fraction ${fraction.numerator}/${fraction.denominator}` : ''}.
      Keep it very short (under 3 sentences), fun, and use emojis. Use analogies like pizza, chocolate bars, or Lego.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "Let's learn about fractions!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return FALLBACK_EXPLANATIONS[Math.floor(Math.random() * FALLBACK_EXPLANATIONS.length)];
  }
};

export const generateWordProblem = async (): Promise<{ story: string; question: string; n1: number; d1: number; n2: number; d2: number; op: 'add'|'sub' } | null> => {
  // Check online status
  if (!navigator.onLine) {
    const randomProblem = FALLBACK_PROBLEMS[Math.floor(Math.random() * FALLBACK_PROBLEMS.length)];
    // @ts-ignore
    return randomProblem;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Generate a fun, simple fraction word problem for a 8 year old involving adding two fractions with the same denominator. The denominators should be between 2 and 12.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING, description: "The fun context story (e.g. dragons eating pie)" },
            question: { type: Type.STRING, description: "The specific question asking for the total." },
            n1: { type: Type.INTEGER, description: "Numerator of first fraction" },
            d1: { type: Type.INTEGER, description: "Denominator of first fraction" },
            n2: { type: Type.INTEGER, description: "Numerator of second fraction" },
            d2: { type: Type.INTEGER, description: "Denominator of second fraction (must match d1)" },
            op: { type: Type.STRING, description: "Operation", enum: ["add", "sub"] }
          },
          required: ["story", "question", "n1", "d1", "n2", "d2", "op"]
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return a random fallback problem on error
    // @ts-ignore
    return FALLBACK_PROBLEMS[Math.floor(Math.random() * FALLBACK_PROBLEMS.length)];
  }
};