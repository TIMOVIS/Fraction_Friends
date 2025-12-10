import React, { useMemo } from 'react';
import { Fraction } from '../types';

interface VisualFractionProps {
  fraction: Fraction;
  size?: number;
  type?: 'pie' | 'bar';
  color?: string;
  highlightIndices?: number[]; // Specific slices to highlight (optional)
  interactive?: boolean;
  onClickSlice?: (index: number) => void;
}

export const VisualFraction: React.FC<VisualFractionProps> = ({ 
  fraction, 
  size = 200, 
  type = 'pie',
  color = 'fill-sky-400',
  highlightIndices,
  interactive = false,
  onClickSlice
}) => {
  const { numerator, denominator } = fraction;
  const radius = 45;
  const center = 50;

  // Pie Chart Logic
  const slices = useMemo(() => {
    if (denominator === 0) return [];
    const sliceAngle = 360 / denominator;
    
    return Array.from({ length: denominator }).map((_, index) => {
      const startAngle = (index * sliceAngle) - 90; // Start from top
      const endAngle = ((index + 1) * sliceAngle) - 90;
      
      const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

      // SVG Path command
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      const pathData = denominator === 1 
        ? `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius}`
        : `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = highlightIndices 
        ? highlightIndices.includes(index)
        : index < numerator;

      return (
        <path
          key={index}
          d={pathData}
          // Added origin-center and active:scale-95 for touch feedback
          style={{ transformOrigin: '50% 50%' }}
          className={`transition-all duration-200 ease-out stroke-white stroke-2 ${
            isFilled ? color : 'fill-slate-200 hover:fill-slate-300'
          } ${interactive ? 'cursor-pointer hover:opacity-90 active:scale-95 hover:scale-105' : ''}`}
          onClick={() => interactive && onClickSlice && onClickSlice(index)}
        />
      );
    });
  }, [numerator, denominator, highlightIndices, color, interactive, onClickSlice]);

  // Bar Chart Logic
  const bars = useMemo(() => {
    return Array.from({ length: denominator }).map((_, index) => {
      const isFilled = highlightIndices 
        ? highlightIndices.includes(index)
        : index < numerator;

      return (
        <div 
          key={index}
          onClick={() => interactive && onClickSlice && onClickSlice(index)}
          className={`flex-1 h-full border-r-2 border-white last:border-r-0 transition-all duration-200 ${
            isFilled ? color.replace('fill-', 'bg-') : 'bg-slate-200'
          } ${interactive ? 'cursor-pointer hover:opacity-90 active:opacity-75' : ''}`}
        />
      )
    });
  }, [numerator, denominator, highlightIndices, color, interactive, onClickSlice]);

  if (type === 'bar') {
    return (
      <div 
        style={{ width: size, height: size / 4 }} 
        className="flex rounded-lg overflow-hidden border-2 border-slate-300 bg-white shadow-sm"
      >
        {bars}
      </div>
    );
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className="drop-shadow-md select-none"
    >
      <circle cx="50" cy="50" r="48" className="fill-white stroke-slate-300 stroke-2" />
      {slices}
    </svg>
  );
};