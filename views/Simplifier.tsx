import React, { useState, useEffect } from 'react';
import { VisualFraction } from '../components/VisualFraction';
import { FractionInput } from '../components/FractionInput';
import { ShareButton } from '../components/ShareTools';
import { ViewMode } from '../types';
import { Wand2, CheckCircle, XCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

type Step = 'gcd' | 'result' | 'complete';

// Difficulty levels: 0 = easy, 1 = medium, 2 = hard
type Difficulty = 0 | 1 | 2;

// Generate a random fraction that can be simplified (GCD > 1)
// Difficulty: 0 = easy (small numbers, GCD 2), 1 = medium, 2 = hard (larger numbers, various GCDs)
const generateRandomFraction = (difficulty: Difficulty = 1): { num: number; den: number } => {
  let denominators: number[];
  let preferredGcd: number[];
  
  if (difficulty === 0) {
    // Easy: small denominators, simple GCD of 2
    denominators = [4, 6, 8, 10];
    preferredGcd = [2];
  } else if (difficulty === 1) {
    // Medium: medium denominators, GCD 2-3
    denominators = [6, 8, 9, 10, 12, 14, 15];
    preferredGcd = [2, 3];
  } else {
    // Hard: larger denominators, various GCDs
    denominators = [12, 14, 15, 16, 18, 20, 21, 24];
    preferredGcd = [2, 3, 4, 5, 6];
  }
  
  const den = denominators[Math.floor(Math.random() * denominators.length)];
  
  // Find factors of the denominator
  const factors: number[] = [];
  for (let i = 2; i <= den / 2; i++) {
    if (den % i === 0) {
      factors.push(i);
    }
  }
  
  // Filter factors to prefer easier GCDs for lower difficulty
  const availableFactors = factors.filter(f => preferredGcd.includes(f));
  const factorPool = availableFactors.length > 0 ? availableFactors : factors;
  
  // If no suitable factors, use a simple approach
  if (factorPool.length === 0) {
    const multiplier = difficulty === 0 ? 2 : Math.floor(Math.random() * 2) + 2;
    const num = multiplier * Math.floor(Math.random() * (den / multiplier - 1)) + multiplier;
    return { num: Math.min(num, den - 1), den };
  }
  
  // Pick a factor (prefer smaller for easier difficulty)
  const factor = difficulty === 0 
    ? factorPool[0] // Always use the smallest factor for easy
    : factorPool[Math.floor(Math.random() * factorPool.length)];
  
  const maxMultiplier = Math.floor((den - 1) / factor);
  const multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
  const num = factor * multiplier;
  
  // Ensure num < den
  return { num: Math.min(num, den - 1), den };
};

// GCD Helper
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export const Simplifier: React.FC = () => {
  // Difficulty tracking: starts at medium (1), adjusts based on performance
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  
  // Initialize fraction from URL or generate random
  const [fraction, setFraction] = useState<{ num: number; den: number }>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === ViewMode.SIMPLIFY) {
      const n = parseInt(params.get('n') || '');
      const d = parseInt(params.get('d') || '');
      if (n && d && n < d && d > 0) {
        return { num: n, den: d };
      }
    }
    return generateRandomFraction(1); // Start with medium difficulty
  });

  const [step, setStep] = useState<Step>('gcd');
  const [gcdAnswer, setGcdAnswer] = useState<string>('');
  const [resultNum, setResultNum] = useState<string>('');
  const [resultDen, setResultDen] = useState<string>('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [confetti, setConfetti] = useState<number[]>([]);

  const correctGcd = gcd(fraction.num, fraction.den);
  const simplifiedNum = fraction.num / correctGcd;
  const simplifiedDen = fraction.den / correctGcd;
  const isAlreadySimplified = correctGcd === 1;

  // Reset when fraction changes
  useEffect(() => {
    setStep('gcd');
    setGcdAnswer('');
    setResultNum('');
    setResultDen('');
    setFeedback('none');
    setConfetti([]);
  }, [fraction.num, fraction.den]);

  const handleGcdSubmit = () => {
    const answer = parseInt(gcdAnswer);
    if (answer === correctGcd) {
      setFeedback('correct');
      // Move to next step after a brief delay
      setTimeout(() => {
        setStep('result');
        setFeedback('none');
      }, 1500);
    } else {
      setFeedback('incorrect');
      setGcdAnswer('');
    }
  };

  const handleTryEasier = () => {
    // Decrease difficulty and generate a new easier problem
    const newDifficulty = Math.max(0, difficulty - 1) as Difficulty;
    setDifficulty(newDifficulty);
    setFraction(generateRandomFraction(newDifficulty));
    // Reset state
    setStep('gcd');
    setGcdAnswer('');
    setResultNum('');
    setResultDen('');
    setFeedback('none');
  };

  const handleResultSubmit = () => {
    const num = parseInt(resultNum);
    const den = parseInt(resultDen);
    if (num === simplifiedNum && den === simplifiedDen) {
      setFeedback('correct');
      // Increase difficulty when correct (gradually)
      if (difficulty < 2) {
        setDifficulty((difficulty + 1) as Difficulty);
      }
      // Trigger confetti
      setConfetti(Array.from({length: 50}).map((_, i) => i));
      setTimeout(() => {
        setStep('complete');
      }, 1500);
    } else {
      setFeedback('incorrect');
      setResultNum('');
      setResultDen('');
    }
  };

  const handleNewProblem = () => {
    // Use current difficulty level for next problem
    setFraction(generateRandomFraction(difficulty));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 gap-8">
      <div className="flex justify-between items-end w-full max-w-2xl px-4">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-sky-600">Magic Simplifier</h2>
            <p className="text-slate-500 text-sm md:text-base">Find the number to divide by, then simplify!</p>
        </div>
        <ShareButton params={{ mode: ViewMode.SIMPLIFY, n: fraction.num, d: fraction.den }} />
      </div>

      {/* CSS Confetti */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed;
          top: -20px;
          width: 10px;
          height: 10px;
          animation: fall 3s linear forwards;
          z-index: 100;
        }
      `}</style>
      
      {confetti.map((i) => (
        <div 
          key={i} 
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}vw`,
            backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}

      {/* Original Fraction Display */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border border-sky-100">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-2">Simplify this fraction:</h3>
            {isAlreadySimplified && (
              <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
                This fraction is already in simplest form!
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <VisualFraction 
              fraction={{ numerator: fraction.num, denominator: fraction.den }} 
              size={220} 
              color="fill-sky-400"
            />
            <div className="flex flex-col items-center gap-2 font-bold text-2xl text-slate-700 bg-sky-50 p-4 rounded-xl border border-sky-200 min-w-[120px]">
              <span>{fraction.num}</span>
              <div className="w-full h-1 bg-sky-300 rounded-full"></div>
              <span>{fraction.den}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Find GCD */}
      {step === 'gcd' && (
        <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border border-purple-100">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-purple-700 mb-2">Step 1: Find the number to divide by</h3>
              <p className="text-slate-600">What is the largest number that divides both {fraction.num} and {fraction.den}?</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={gcdAnswer}
                  onChange={(e) => {
                    setGcdAnswer(e.target.value);
                    setFeedback('none');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGcdSubmit();
                    }
                  }}
                  placeholder="?"
                  className="w-24 h-16 text-3xl font-bold text-center border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  min="1"
                  autoFocus
                />
              </div>

              {feedback === 'correct' && (
                <div className="flex items-center gap-2 text-green-600 font-bold animate-bounce">
                  <CheckCircle size={24} />
                  <span>Correct! Now calculate the simplified fraction.</span>
                </div>
              )}

              {feedback === 'incorrect' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-red-600 font-bold">
                    <XCircle size={24} />
                    <span>Not quite! Try again. Remember, you need the largest number that divides both.</span>
                  </div>
                  <button
                    onClick={handleTryEasier}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <RefreshCw size={16} />
                    Try an easier one
                  </button>
                </div>
              )}

              <button
                onClick={handleGcdSubmit}
                disabled={!gcdAnswer || feedback === 'correct'}
                className="mt-4 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Check Answer
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Calculate Result */}
      {step === 'result' && (
        <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border border-emerald-100">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">Step 2: Calculate the simplified fraction</h3>
              <p className="text-slate-600">
                Divide {fraction.num} ÷ {correctGcd} = ? and {fraction.den} ÷ {correctGcd} = ?
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="number"
                    value={resultNum}
                    onChange={(e) => {
                      setResultNum(e.target.value);
                      setFeedback('none');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleResultSubmit();
                      }
                    }}
                    placeholder="?"
                    className="w-20 h-14 text-2xl font-bold text-center border-2 border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    min="1"
                    autoFocus
                  />
                  <div className="w-16 h-1 bg-emerald-300 rounded-full"></div>
                  <input
                    type="number"
                    value={resultDen}
                    onChange={(e) => {
                      setResultDen(e.target.value);
                      setFeedback('none');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleResultSubmit();
                      }
                    }}
                    placeholder="?"
                    className="w-20 h-14 text-2xl font-bold text-center border-2 border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    min="1"
                  />
                </div>
              </div>

              {feedback === 'correct' && (
                <div className="flex items-center gap-2 text-green-600 font-bold animate-bounce">
                  <CheckCircle size={24} />
                  <span>Excellent! You simplified it correctly!</span>
                </div>
              )}

              {feedback === 'incorrect' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-red-600 font-bold">
                    <XCircle size={24} />
                    <span>Not quite! Try again. Remember: {fraction.num} ÷ {correctGcd} and {fraction.den} ÷ {correctGcd}</span>
                  </div>
                  <button
                    onClick={handleTryEasier}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <RefreshCw size={16} />
                    Try an easier one
                  </button>
                </div>
              )}

              <button
                onClick={handleResultSubmit}
                disabled={!resultNum || !resultDen || feedback === 'correct'}
                className="mt-4 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Check Answer
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Show Result */}
      {step === 'complete' && (
        <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border border-emerald-200 relative overflow-hidden">
          <div className="flex flex-col items-center gap-6">
            <div className="absolute top-4 right-4 text-emerald-500 font-bold flex items-center gap-1 animate-bounce bg-emerald-100 px-3 py-1 rounded-full text-sm">
              <Sparkles size={16} /> Perfect!
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">Simplified Fraction</h3>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <VisualFraction 
                fraction={{ numerator: simplifiedNum, denominator: simplifiedDen }} 
                size={220} 
                color="fill-emerald-400"
              />
              <div className="flex flex-col items-center gap-2 font-bold text-2xl text-slate-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200 min-w-[120px]">
                <span>{simplifiedNum}</span>
                <div className="w-full h-1 bg-emerald-300 rounded-full"></div>
                <span>{simplifiedDen}</span>
              </div>
            </div>

            <button
              onClick={handleNewProblem}
              className="mt-4 px-8 py-3 bg-sky-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <RefreshCw size={20} />
              Try Another Problem
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
