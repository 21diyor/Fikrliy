
import React, { useState, useEffect, useRef } from 'react';
import { Question, MascotMood } from '../types';
import Mascot from './Mascot';
import { getGeminiHint } from '../services/geminiService';

interface QuestionViewProps {
  question: Question;
  onCorrect: () => void;
  onExit: () => void;
  currentStep: number;
  totalSteps: number;
}

const QuestionView: React.FC<QuestionViewProps> = ({ question, onCorrect, onExit, currentStep, totalSteps }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [loadingHint, setLoadingHint] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [isDiscoverySuccess, setIsDiscoverySuccess] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setStatus('idle');
    setHint(null);
    setIsDiscoverySuccess(false);
    setHasInteracted(false);
    if (!audioCtx.current) {
       audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [question]);

  const playSound = (type: string) => {
    if (!audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = ctx.currentTime;

    const playTone = (freq: number, duration: number, vol: number, oscType: OscillatorType = 'sine', ramp: boolean = true) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(vol, now);
      if (ramp) gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + duration);
    };

    switch(type) {
      case 'select': playTone(600, 0.1, 0.05); break;
      case 'tap_select': playTone(500, 0.05, 0.03, 'sine', false); break;
      case 'snap_drop': playTone(800, 0.1, 0.04, 'triangle'); break;
      case 'rotate_tick': playTone(300, 0.02, 0.02, 'square'); break;
      case 'submit': playTone(200, 0.1, 0.1, 'square'); break;
      case 'correct':
        playTone(523.25, 0.5, 0.1);
        setTimeout(() => playTone(659.25, 0.5, 0.08), 100);
        setTimeout(() => playTone(783.99, 0.6, 0.06), 200);
        break;
      case 'incorrect': playTone(180, 0.4, 0.1, 'triangle'); break;
      case 'discover': playTone(880, 0.3, 0.05); break;
    }
  };

  const handleSubmit = () => {
    playSound('submit');
    
    let isCorrect = false;

    // Logic Refinement:
    // If multiple-choice options are provided, the selected option is the primary requirement.
    if (question.options && question.options.length > 0) {
      isCorrect = selectedOption === question.correctAnswer;
    } 
    // Otherwise, if it's purely interactive (discovery), use the interactive success state.
    else if (question.interactive) {
      isCorrect = isDiscoverySuccess;
    }

    if (isCorrect) {
      setStatus('correct');
      playSound('correct');
    } else {
      setStatus('wrong');
      playSound('incorrect');
    }
  };

  const handleDiscovery = (success: boolean) => {
    setIsDiscoverySuccess(success);
    setHasInteracted(true);
    // Auto-complete for pure discovery tasks if the goal is met
    if (success && (!question.options || question.options.length === 0)) {
       // Optional: We could trigger success automatically here, but usually best to wait for the button.
       playSound('discover');
    }
  };

  const handleGetHint = async () => {
    if (loadingHint) return;
    setLoadingHint(true);
    const aiHint = await getGeminiHint(question.prompt, "Donish the cat feedback");
    setHint(aiHint);
    setLoadingHint(false);
  };

  const handleOptionSelect = (opt: string) => {
    if (status === 'correct') return;
    setSelectedOption(opt);
    setStatus('idle');
    playSound('select');
  };

  const isComplete = status === 'correct';
  const progressWidth = ((currentStep + (isComplete ? 1 : 0)) / totalSteps) * 100;
  
  // Submit is enabled if:
  // - There are options and one is selected
  // - OR there's an interaction and it has been interacted with
  const isSubmitDisabled = question.options && question.options.length > 0 
    ? !selectedOption 
    : !hasInteracted;

  const getDonishSpeech = () => {
    if (status === 'correct') return `Zo’r! Ajoyib! ✨ ${question.explanation}`;
    if (status === 'wrong') return hint || "Hmm, bir oz o'ylab ko'raylik-chi? 🐾";
    if (hint) return hint;
    return "Tayyormisiz? Keling, birgalikda kashf qilamiz! 🐾";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-center px-4">
        <button onClick={onExit} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors">✕</button>
        <div className="flex-1 mx-8 relative h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
           <div className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${progressWidth}%` }} />
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm font-black text-slate-700">
          {currentStep + 1}/{totalSteps}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start px-4">
        <div className={`bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden min-h-[500px] transition-all duration-300 ${status === 'wrong' ? 'animate-shake' : ''}`}>
          <div className="space-y-10">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug">{question.prompt}</h2>
              {question.subPrompt && <p className="text-lg font-medium text-slate-400 italic">{question.subPrompt}</p>}
            </div>
            
            <div className="flex justify-center py-6">
              {question.interactive ? (
                <question.interactive state={null} onDiscover={handleDiscovery} playSound={playSound} />
              ) : question.illustration}
            </div>

            {question.options && question.options.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {question.options.map(opt => (
                  <button 
                    key={opt}
                    disabled={isComplete}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-6 rounded-3xl border-2 transition-all font-bold text-xl ${
                      selectedOption === opt 
                      ? (status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg' : status === 'wrong' ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-lg' : 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-50')
                      : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {!isComplete && (
                <>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitDisabled}
                    className={`flex-1 py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-xl ${
                      isSubmitDisabled 
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-black shadow-slate-100'
                    }`}
                  >
                    Tekshirish
                  </button>
                  
                  <button onClick={handleGetHint} disabled={loadingHint || isComplete} className="w-20 h-20 flex items-center justify-center border-2 border-slate-100 rounded-[2.5rem] hover:bg-amber-50 hover:border-amber-200 transition-all text-3xl">
                    {loadingHint ? <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div> : "💡"}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Explanation Micro-Animation Overlay */}
          {isComplete && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-5xl animate-bounce shadow-lg shadow-emerald-100/50">✨</div>
               <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Ajoyib!</h3>
               <p className="text-xl font-bold text-slate-600 max-w-md mb-10 leading-relaxed">{question.explanation}</p>
               <button 
                 onClick={onCorrect} 
                 className="w-full max-w-sm py-6 bg-emerald-500 text-white rounded-[2.5rem] font-black text-2xl hover:bg-emerald-600 shadow-2xl shadow-emerald-200 hover:scale-105 transition-all active:scale-95 animate-in slide-in-from-bottom-4 delay-300"
               >
                 Davom etish →
               </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center lg:items-start gap-6 lg:sticky lg:top-24">
           <Mascot mood={isComplete ? 'excited' : status === 'wrong' ? 'sad' : loadingHint ? 'thinking' : 'thinking'} size="lg" />
           <div className="relative w-full bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 speech-bubble animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Donishdan</h4>
              </div>
              <p className={`text-lg font-bold leading-snug transition-colors duration-500 ${isComplete ? 'text-emerald-900' : 'text-slate-700'}`}>
                {getDonishSpeech()}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;
