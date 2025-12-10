export interface Fraction {
  numerator: number;
  denominator: number;
}

export enum ViewMode {
  EXPLORE = 'explore',
  SIMPLIFY = 'simplify',
  ADDITION = 'addition',
  WORD_PROBLEMS = 'word_problems',
}

export interface WordProblem {
  question: string;
  context: string; // The "story" part
  fraction1: Fraction;
  fraction2: Fraction;
  operation: 'add' | 'subtract';
  answer: Fraction;
}