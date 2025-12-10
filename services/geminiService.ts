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

// --- Fallback Word Problems ---
// These are used instead of AI-generated problems

const FALLBACK_PROBLEMS = [
  {
    story: "A hungry dragon 🐉 found a giant cherry pie. He ate some for breakfast and some for lunch.",
    question: "How much pie did the dragon eat in total?",
    n1: 1, d1: 4, n2: 2, d2: 4, op: 'add' as const
  },
  {
    story: "Two aliens 👽 are painting a spaceship. Zorg paints a small part red, and Blip paints another part blue.",
    question: "What fraction of the spaceship is painted now?",
    n1: 2, d1: 6, n2: 3, d2: 6, op: 'add' as const
  },
  {
    story: "A wizard 🧙‍♂️ is mixing a potion. He adds some frog slime and then adds some bat wings.",
    question: "How full is the potion cauldron now?",
    n1: 3, d1: 8, n2: 4, d2: 8, op: 'add' as const
  },
  {
    story: "A friendly robot 🤖 is building a tower with colorful blocks. First it uses some blocks, then adds more.",
    question: "What fraction of the tower is built?",
    n1: 2, d1: 5, n2: 2, d2: 5, op: 'add' as const
  },
  {
    story: "A cat 🐱 found a big bowl of milk. She drank some in the morning and more in the afternoon.",
    question: "How much milk did the cat drink?",
    n1: 1, d1: 3, n2: 1, d2: 3, op: 'add' as const
  },
  {
    story: "A penguin 🐧 is collecting fish for dinner. It caught some fish, then caught a few more.",
    question: "What fraction of fish did the penguin collect?",
    n1: 3, d1: 10, n2: 4, d2: 10, op: 'add' as const
  },
  {
    story: "A unicorn 🦄 is decorating a rainbow. It painted one part pink and another part purple.",
    question: "How much of the rainbow is decorated?",
    n1: 2, d1: 7, n2: 3, d2: 7, op: 'add' as const
  },
  {
    story: "A monkey 🐵 is sharing bananas with friends. It gave away some bananas, then gave away more.",
    question: "What fraction of bananas did the monkey share?",
    n1: 1, d1: 6, n2: 2, d2: 6, op: 'add' as const
  },
  {
    story: "A bear 🐻 is collecting honey from two beehives. It got some honey from the first hive and more from the second.",
    question: "How much honey did the bear collect in total?",
    n1: 2, d1: 9, n2: 4, d2: 9, op: 'add' as const
  },
  {
    story: "A dolphin 🐬 is jumping through hoops. It jumped through some hoops, then jumped through more.",
    question: "What fraction of hoops did the dolphin jump through?",
    n1: 2, d1: 8, n2: 2, d2: 8, op: 'add' as const
  },
  {
    story: "A bunny 🐰 is planting carrots in a garden. It planted some carrots in one row and more in another row.",
    question: "How much of the garden has carrots?",
    n1: 3, d1: 12, n2: 5, d2: 12, op: 'add' as const
  },
  {
    story: "A lion 🦁 is sharing a big meal with the pride. It ate some of the meal, then ate more.",
    question: "What fraction of the meal did the lion eat?",
    n1: 1, d1: 5, n2: 2, d2: 5, op: 'add' as const
  }
];

// --- Service Functions ---

export const getExplanation = async (topic: string, fraction?: Fraction): Promise<string> => {
  // Add a small delay to simulate thinking (optional, can be removed)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Select a random explanation
  const randomIndex = Math.floor(Math.random() * FALLBACK_EXPLANATIONS.length);
  return FALLBACK_EXPLANATIONS[randomIndex];
};

export const generateWordProblem = async (): Promise<{ story: string; question: string; n1: number; d1: number; n2: number; d2: number; op: 'add'|'sub' }> => {
  try {
    // Add a small delay to simulate loading (optional, can be removed)
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Select a random problem - always return a valid problem
    if (FALLBACK_PROBLEMS.length === 0) {
      // Fallback in case array is empty (should never happen)
      return {
        story: "A friendly robot 🤖 is building a tower with colorful blocks. First it uses some blocks, then adds more.",
        question: "What fraction of the tower is built?",
        n1: 2, d1: 5, n2: 2, d2: 5, op: 'add'
      };
    }
    
    const randomIndex = Math.floor(Math.random() * FALLBACK_PROBLEMS.length);
    return FALLBACK_PROBLEMS[randomIndex];
  } catch (error) {
    console.error("Error generating word problem:", error);
    // Return the first problem as a safe fallback
    return FALLBACK_PROBLEMS[0] || {
      story: "A hungry dragon 🐉 found a giant cherry pie. He ate some for breakfast and some for lunch.",
      question: "How much pie did the dragon eat in total?",
      n1: 1, d1: 4, n2: 2, d2: 4, op: 'add'
    };
  }
};
