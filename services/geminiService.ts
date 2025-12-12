import { Fraction } from "../types";

// --- Fallback Explanations ---
// These are used instead of AI-generated explanations

const FALLBACK_EXPLANATIONS = [
  "Fractions are like sharing a pizza! 🍕 The bottom number is how many slices total, and the top number is how many you eat.",
  "Imagine a chocolate bar! 🍫 If you break it into pieces, each piece is a fraction of the whole bar.",
  "Think of Lego bricks! 🧱 If you have a tower of 4 bricks and take 1 off, you took 1/4 of the tower.",
  "Simplifying is like tidying up! 🧹 We make the numbers smaller, but the amount of cake stays exactly the same.",
  "When we simplify, we're finding the biggest number that divides both the top and bottom evenly! 🎯",
  "It's like reducing a recipe - we use smaller numbers, but the taste (the value) stays the same! 🍰",
  "Think of it like folding paper! 📄 We fold it to make it smaller, but it's still the same piece of paper.",
  "Simplifying fractions is like finding the simplest way to say the same thing! 💬",
  "If you have 4/8 of a pizza, that's the same as 1/2 - half a pizza! 🍕 Both mean the same amount!",
  "We divide both numbers by the same thing to make them smaller, but keep the fraction equal! ✨"
];

// --- Service Functions ---

export const getExplanation = async (topic: string, fraction?: Fraction): Promise<string> => {
  // Add a small delay to simulate thinking (optional, can be removed)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Select a random explanation
  const randomIndex = Math.floor(Math.random() * FALLBACK_EXPLANATIONS.length);
  return FALLBACK_EXPLANATIONS[randomIndex];
};
