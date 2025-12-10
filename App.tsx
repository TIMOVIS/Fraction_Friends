import React, { useState, useEffect } from 'react';
import { Simplifier } from './views/Simplifier';
import { Calculator } from './views/Calculator';
import { WordProblems } from './views/WordProblems';
import { ViewMode } from './types';
import { Calculator as CalcIcon, Wand2, BookOpen, Pizza } from 'lucide-react';

export default function App() {
  const [view, setViewState] = useState<ViewMode>(() => {
    // Initialize view from URL if present
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') as ViewMode;
    return Object.values(ViewMode).includes(mode) ? mode : ViewMode.SIMPLIFY;
  });

  const setView = (mode: ViewMode) => {
    setViewState(mode);
    // Clear URL parameters when manually navigating to avoid confusion
    window.history.replaceState({}, '', window.location.pathname);
  };

  const NavItem = ({ mode, icon: Icon, label, color }: { mode: ViewMode, icon: any, label: string, color: string }) => (
    <button
      onClick={() => setView(mode)}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 w-24 md:w-32 ${
        view === mode 
          ? `${color} text-white shadow-lg scale-110` 
          : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      <Icon className="w-8 h-8" />
      <span className="text-sm font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-sky-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-sky-500 p-2 rounded-xl text-white">
                    <Pizza size={28} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Fraction Friends</h1>
            </div>
            <div className="hidden md:block text-sm font-semibold text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
                Year 3 & 4 Maths
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pt-8 px-4">
        
        {/* Navigation Grid */}
        <div className="flex justify-center gap-4 md:gap-8 mb-12">
            <NavItem 
                mode={ViewMode.SIMPLIFY} 
                icon={Wand2} 
                label="Simplify" 
                color="bg-purple-500" 
            />
            <NavItem 
                mode={ViewMode.ADDITION} 
                icon={CalcIcon} 
                label="Add" 
                color="bg-pink-500" 
            />
            <NavItem 
                mode={ViewMode.WORD_PROBLEMS} 
                icon={BookOpen} 
                label="Story Time" 
                color="bg-indigo-500" 
            />
        </div>

        {/* View Container */}
        <div className="animate-fade-in">
            {view === ViewMode.SIMPLIFY && <Simplifier />}
            {view === ViewMode.ADDITION && <Calculator />}
            {view === ViewMode.WORD_PROBLEMS && <WordProblems />}
        </div>

      </main>

      <footer className="text-center text-slate-400 py-8 mt-12">
        <p>Made with 💙 for learning</p>
      </footer>
      
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}