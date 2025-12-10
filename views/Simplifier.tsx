import React, { useState } from 'react';
import { VisualFraction } from '../components/VisualFraction';
import { FractionInput } from '../components/FractionInput';
import { getExplanation } from '../services/geminiService';
import { Wand2, Lightbulb, Sparkles } from 'lucide-react';
import { ShareButton } from '../components/ShareTools';
import { ViewMode } from '../types';

export const Simplifier: React.FC = () => {
  const [num, setNum] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === ViewMode.SIMPLIFY ? parseInt(params.get('n') || '4') : 4;
  });
  const [den, setDen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === ViewMode.SIMPLIFY ? parseInt(params.get('d') || '8') : 8;
  });
  
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // GCD Helper
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(num, den);
  const simplifiedNum = num / divisor;
  const simplifiedDen = den / divisor;
  const isSimplified = divisor === 1;
  const isFullySimplified = num === simplifiedNum && den === simplifiedDen;

  const handleAsk = async () => {
    setLoading(true);
    const text = await getExplanation("simplifying fractions", { numerator: num, denominator: den });
    setExplanation(text);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 gap-8">
      <div className="flex justify-between items-end w-full max-w-2xl px-4">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-sky-600">Magic Simplifier</h2>
            <p className="text-slate-500 text-sm md:text-base">Make the numbers smaller, but keep the pizza the same!</p>
        </div>
        <ShareButton params={{ mode: ViewMode.SIMPLIFY, n: num, d: den }} />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 bg-white p-8 rounded-3xl shadow-lg border border-sky-100 relative overflow-hidden">
        
        {/* Input Side */}
        <div className="flex flex-col items-center gap-4 z-10">
          <VisualFraction 
            fraction={{ numerator: num, denominator: den }} 
            size={220} 
            color="fill-sky-400"
            interactive={true}
            onClickSlice={(i) => {
                // If clicking the last filled slice, toggle it off. Otherwise fill up to clicked slice.
                const newNum = (i + 1 === num) ? i : i + 1;
                setNum(newNum);
                setExplanation("");
            }} 
          />
          <FractionInput 
            numerator={num} 
            denominator={den} 
            onChange={(n, d) => {
              // Ensure n doesn't exceed d
              const safeN = n > d ? d : n;
              setNum(safeN); 
              setDen(d);
              setExplanation(""); 
            }} 
          />
        </div>

        <div className="flex flex-col items-center gap-2 z-10">
            <Wand2 className={`w-12 h-12 ${isSimplified ? 'text-emerald-400' : 'text-purple-500 animate-pulse'}`} />
            <div className="text-2xl font-bold text-slate-400">=</div>
        </div>

        {/* Output Side */}
        <div className="flex flex-col items-center gap-4 z-10">
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
        
        {/* Background celebration for fully simplified input */}
        {isFullySimplified && den > 1 && (
             <div className="absolute top-4 right-4 text-emerald-500 font-bold flex items-center gap-1 animate-bounce bg-emerald-100 px-3 py-1 rounded-full text-sm">
                <Sparkles size={16} /> Simplest Form!
             </div>
        )}
      </div>

      {/* Explanation Box */}
      <div className="w-full max-w-2xl">
        {!explanation ? (
          <button 
            onClick={handleAsk}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Lightbulb className="w-6 h-6" />
            {loading ? "Thinking..." : "Why are they the same?"}
          </button>
        ) : (
           <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 text-amber-900 text-lg relative">
             <button onClick={() => setExplanation("")} className="absolute top-2 right-4 text-amber-400 hover:text-amber-600 text-2xl">&times;</button>
             <div className="flex gap-4">
               <span className="text-4xl">🦉</span>
               <p>{explanation}</p>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};