import React, { useState } from 'react';
import { VisualFraction } from '../components/VisualFraction';
import { FractionInput } from '../components/FractionInput';
import { Plus, Equal, RefreshCw } from 'lucide-react';
import { ShareButton } from '../components/ShareTools';
import { ViewMode } from '../types';

export const Calculator: React.FC = () => {
  const [den, setDen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === ViewMode.ADDITION ? parseInt(params.get('d') || '4') : 4;
  });
  const [num1, setNum1] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === ViewMode.ADDITION ? parseInt(params.get('n1') || '1') : 1;
  });
  const [num2, setNum2] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === ViewMode.ADDITION ? parseInt(params.get('n2') || '2') : 2;
  });

  const resultNum = num1 + num2;
  const resultDen = den; 

  // Custom visual for the result to support two colors
  const ResultVisual = () => {
    return (
      <div className="relative" style={{ width: 220, height: 220 }}>
        {/* We overlay two charts. One for the first part, one for the second part rotated */}
        <div className="absolute inset-0 z-10">
           <VisualFraction 
              fraction={{ numerator: num1, denominator: den }} 
              size={220} 
              color="fill-sky-400"
              highlightIndices={Array.from({length: num1}).map((_, i) => i)}
            />
        </div>
        <div className="absolute inset-0 z-20 mix-blend-multiply">
           <VisualFraction 
              fraction={{ numerator: den, denominator: den }} // Full circle context
              size={220} 
              color="fill-orange-400"
              highlightIndices={Array.from({length: num2}).map((_, i) => i + num1)}
            />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 gap-8">
      <div className="flex justify-between items-end w-full max-w-3xl px-4">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-pink-600">Pizza Party Adder</h2>
            <p className="text-slate-500">Combine the slices! How much do we have in total?</p>
        </div>
        <ShareButton params={{ mode: ViewMode.ADDITION, n1: num1, n2: num2, d: den }} />
      </div>

      {/* Control for Denominator */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <span className="font-bold text-slate-600">Slices per Pizza:</span>
        <button onClick={() => setDen(Math.max(2, den - 1))} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200">-</button>
        <span className="text-xl font-bold w-6 text-center">{den}</span>
        <button onClick={() => setDen(Math.min(12, den + 1))} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200">+</button>
        <button 
            onClick={() => { setNum1(1); setNum2(1); }}
            className="ml-4 p-2 text-slate-400 hover:text-pink-500"
        >
            <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
        
        {/* Fraction 1 */}
        <div className="flex flex-col items-center gap-4">
          <VisualFraction 
            fraction={{ numerator: num1, denominator: den }} 
            size={180} 
            color="fill-sky-400"
            interactive={true}
            onClickSlice={(i) => {
                const newN = i + 1 === num1 ? i : i + 1;
                // Only allow update if total doesn't exceed denominator
                if (newN + num2 <= den) {
                    setNum1(newN);
                }
            }}
          />
          <FractionInput 
            numerator={num1} 
            denominator={den} 
            readOnly={false}
            onChange={(n) => setNum1(Math.min(den - num2, n))} // Prevent overflow
          />
        </div>

        <Plus className="text-slate-300 w-12 h-12" />

        {/* Fraction 2 */}
        <div className="flex flex-col items-center gap-4">
          <VisualFraction 
            fraction={{ numerator: num2, denominator: den }} 
            size={180} 
            color="fill-orange-400"
            interactive={true}
            onClickSlice={(i) => {
                const newN = i + 1 === num2 ? i : i + 1;
                // Only allow update if total doesn't exceed denominator
                if (num1 + newN <= den) {
                    setNum2(newN);
                }
            }}
          />
          <FractionInput 
            numerator={num2} 
            denominator={den} 
            readOnly={false}
            onChange={(n) => setNum2(Math.min(den - num1, n))} // Prevent overflow
          />
        </div>

        <Equal className="text-slate-300 w-12 h-12" />

        {/* Result */}
        <div className="flex flex-col items-center gap-4 bg-pink-50 p-6 rounded-3xl border-2 border-pink-100">
          <ResultVisual />
          <div className="text-3xl font-bold text-pink-600 flex flex-col items-center">
            <span>{resultNum}</span>
            <span className="w-full h-1 bg-pink-300 rounded-full my-1"></span>
            <span>{resultDen}</span>
          </div>
        </div>

      </div>
      
      {resultNum === resultDen && (
        <div className="animate-bounce bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold text-lg shadow-sm border border-yellow-300">
           🎉 You made a whole pizza!
        </div>
      )}
    </div>
  );
};