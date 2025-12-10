import React from 'react';

interface FractionInputProps {
  numerator: number;
  denominator: number;
  onChange: (n: number, d: number) => void;
  maxDenominator?: number;
  readOnly?: boolean;
}

export const FractionInput: React.FC<FractionInputProps> = ({ 
  numerator, 
  denominator, 
  onChange,
  maxDenominator = 12,
  readOnly = false
}) => {
  return (
    <div className="flex flex-col items-center gap-2 font-bold text-2xl text-slate-700 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      {readOnly ? (
        <span className="w-16 text-center py-2">{numerator}</span>
      ) : (
        <div className="flex items-center gap-2">
           <button 
            onClick={() => onChange(Math.max(0, numerator - 1), denominator)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg flex items-center justify-center transition-colors"
          >-</button>
          <span className="w-8 text-center">{numerator}</span>
          <button 
            onClick={() => onChange(Math.min(denominator, numerator + 1), denominator)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg flex items-center justify-center transition-colors"
          >+</button>
        </div>
      )}
      
      <div className="w-full h-1 bg-slate-300 rounded-full"></div>
      
      {readOnly ? (
        <span className="w-16 text-center py-2">{denominator}</span>
      ) : (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onChange(numerator, Math.max(1, denominator - 1))}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg flex items-center justify-center transition-colors"
          >-</button>
          <span className="w-8 text-center">{denominator}</span>
          <button 
            onClick={() => onChange(numerator, Math.min(maxDenominator, denominator + 1))}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg flex items-center justify-center transition-colors"
          >+</button>
        </div>
      )}
    </div>
  );
};