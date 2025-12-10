import React, { useState, useEffect } from 'react';
import { generateWordProblem } from '../services/geminiService';
import { FractionInput } from '../components/FractionInput';
import { VisualFraction } from '../components/VisualFraction';
import { ArrowRight, Star, RefreshCw, PartyPopper } from 'lucide-react';
import { ShareButton } from '../components/ShareTools';
import { ViewMode } from '../types';

interface CurrentProblem {
  story: string;
  question: string;
  n1: number;
  d1: number;
  n2: number;
  d2: number;
  op: 'add' | 'sub';
}

export const WordProblems: React.FC = () => {
  const [problem, setProblem] = useState<CurrentProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [userNum, setUserNum] = useState(0);
  const [userDen, setUserDen] = useState(2);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [confetti, setConfetti] = useState<number[]>([]);

  const fetchProblem = async () => {
    setLoading(true);
    setFeedback('none');
    setConfetti([]);
    setUserNum(0);
    const data = await generateWordProblem();
    if (data) {
      setProblem(data);
      setUserDen(data.d1);
    }
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (params.get('mode') === ViewMode.WORD_PROBLEMS && data) {
        try {
            const decoded = JSON.parse(atob(data));
            setProblem(decoded);
            setUserDen(decoded.d1);
        } catch(e) { fetchProblem(); }
    } else {
        fetchProblem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAnswer = () => {
    if (!problem) return;
    const correctNum = problem.op === 'add' ? problem.n1 + problem.n2 : problem.n1 - problem.n2;
    
    if (userNum === correctNum && userDen === problem.d1) {
      setFeedback('correct');
      // Trigger confetti
      setConfetti(Array.from({length: 50}).map((_, i) => i));
    } else {
      setFeedback('incorrect');
    }
  };

  const getProblemHash = () => {
      if (!problem) return '';
      // Base64 encode the problem object to share it
      return btoa(JSON.stringify(problem));
  }

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-slate-500 font-medium">Dreaming up a story...</p>
        </div>
    )
  }

  if (!problem) {
      return (
          <div className="text-center p-8">
              <p>Oops, the story machine is sleeping. Try refreshing.</p>
              <button onClick={fetchProblem} className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg">Retry</button>
          </div>
      )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative">
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

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-indigo-100">
        
        {/* Story Header */}
        <div className="bg-indigo-500 p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold opacity-90">Daily Challenge</h2>
                    <ShareButton params={{ mode: ViewMode.WORD_PROBLEMS, data: getProblemHash() }} />
                </div>
                <p className="text-3xl font-medium leading-relaxed font-serif">
                    {problem.story}
                </p>
                <p className="mt-6 text-xl bg-indigo-600 inline-block px-4 py-2 rounded-lg">
                    {problem.question}
                </p>
            </div>
            {/* Decorative background circles */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-400 rounded-full opacity-50"></div>
            <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-indigo-300 rounded-full opacity-50"></div>
        </div>

        {/* Workspace */}
        <div className="p-8 bg-white">
            <div className="flex flex-col md:flex-row items-start gap-12">
                
                {/* Visual Hint Area */}
                <div className="flex-1 space-y-6">
                    <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm">Visual Clues</h3>
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="text-center">
                            <VisualFraction size={100} fraction={{numerator: problem.n1, denominator: problem.d1}} color="fill-indigo-400" />
                            <span className="font-bold text-slate-500 mt-2 block">First Part</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-300">+</span>
                        <div className="text-center">
                            <VisualFraction size={100} fraction={{numerator: problem.n2, denominator: problem.d2}} color="fill-purple-400" />
                            <span className="font-bold text-slate-500 mt-2 block">Second Part</span>
                        </div>
                    </div>
                </div>

                {/* Answer Area */}
                <div className="flex-1 flex flex-col items-center bg-slate-50 p-8 rounded-2xl border border-slate-200 w-full">
                    <h3 className="text-slate-500 font-bold mb-4">Your Answer</h3>
                    
                    <div className="mb-6 relative">
                        <VisualFraction 
                            fraction={{numerator: userNum, denominator: userDen}}
                            size={160}
                            color="fill-indigo-500"
                            interactive={true}
                            onClickSlice={(i) => {
                                const newN = (i + 1 === userNum) ? i : i + 1;
                                setUserNum(newN);
                                setFeedback('none');
                            }}
                        />
                         <p className="text-center text-sm text-slate-400 mt-2">Tap to colour!</p>
                         {feedback === 'correct' && (
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce">
                              <Star size={80} className="fill-yellow-400 text-yellow-500 drop-shadow-lg" />
                           </div>
                         )}
                    </div>

                    <FractionInput 
                        numerator={userNum} 
                        denominator={userDen}
                        onChange={(n, d) => {
                            setUserNum(n);
                            setUserDen(d);
                            setFeedback('none');
                        }}
                    />
                    
                    <button 
                        onClick={checkAnswer}
                        disabled={feedback === 'correct'}
                        className={`mt-6 w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 ${
                            feedback === 'correct' 
                            ? 'bg-green-500 text-white cursor-default shadow-none'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                        }`}
                    >
                        {feedback === 'correct' ? (
                            <>
                             <PartyPopper className="w-6 h-6" /> Great Job!
                            </>
                        ) : (
                            <>Check Answer <ArrowRight /></>
                        )}
                    </button>

                    {feedback === 'incorrect' && (
                        <p className="mt-4 text-red-500 font-medium animate-pulse bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                            Not quite! Try counting the colored slices again.
                        </p>
                    )}
                     {feedback === 'correct' && (
                        <button onClick={fetchProblem} className="mt-4 text-slate-400 hover:text-indigo-500 flex items-center gap-2 font-medium">
                            <RefreshCw size={16} /> Try another one
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};