
import React, { useState, useEffect, useRef } from 'react';
import { COURSES } from './constants';
import { Course, World, Module, Level, UserProgress } from './types';
import Mascot from './components/Mascot';
import QuestionView from './components/QuestionView';
import PathMap from './components/PathMap';
import Onboarding from './components/Onboarding';

const StreakOverlay: React.FC<{ count: number; onClose: () => void }> = ({ count, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-900/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center text-center space-y-8 animate-in zoom-in slide-in-from-bottom-12 duration-700">
        <div className="relative">
          <div className="text-8xl animate-bounce">🔥</div>
          <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-30 -z-10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900">{count} Kunlik Streak!</h2>
          <p className="text-lg text-slate-500 font-bold">Donish siz bilan faxrlanadi! 🐾</p>
        </div>
        <button 
          onClick={onClose}
          className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-colors"
        >
          Davom etish
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'path' | 'question' | 'coming-soon' | 'about' | 'onboarding'>('home');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('fikrliy_progress_v3');
    return saved ? JSON.parse(saved) : { completedLevels: [], score: 0, onboardingDone: false, streak: 0 };
  });

  useEffect(() => {
    if (!progress.onboardingDone && view !== 'onboarding') {
      setView('onboarding');
    }
  }, [progress.onboardingDone]);

  useEffect(() => {
    localStorage.setItem('fikrliy_progress_v3', JSON.stringify(progress));
  }, [progress]);

  const currentStep = activeLevel?.steps[activeStepIdx];
  const currentQuestion = currentStep?.questions[activeQuestionIdx];

  const playStreakSound = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    
    // Whoosh + Success Chord
    const playTone = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(200, now, 1.0, 0.1); // Base whoosh
    playTone(523, now + 0.2, 0.8, 0.05); // C5
    playTone(659, now + 0.3, 0.8, 0.05); // E5
    playTone(783, now + 0.4, 1.0, 0.05); // G5
    playTone(1046, now + 0.5, 1.2, 0.05); // C6
  };

  const handleCourseClick = (course: Course) => {
    if (course.isComingSoon) {
      setView('coming-soon');
      return;
    }
    setActiveCourse(course);
    setView('path');
  };

  const startLevel = (level: Level) => {
    setActiveLevel(level);
    setActiveStepIdx(0);
    setActiveQuestionIdx(0);
    setView('question');
  };

  const handleNext = () => {
    if (!activeLevel || !currentStep) return;
    
    if (activeQuestionIdx < currentStep.questions.length - 1) {
      setActiveQuestionIdx(prev => prev + 1);
      setProgress(p => ({ ...p, score: p.score + 10 }));
    } else if (activeStepIdx < activeLevel.steps.length - 1) {
      setActiveStepIdx(prev => prev + 1);
      setActiveQuestionIdx(0);
      setProgress(p => ({ ...p, score: p.score + 20 }));
    } else {
      const isNewCompletion = !progress.completedLevels.includes(activeLevel.id);
      
      // Streak Logic
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastDate = progress.lastCompletionDate;
      
      let newStreak = progress.streak || 0;
      let triggerAnim = false;

      if (!lastDate) {
        newStreak = 1;
        triggerAnim = true;
      } else if (lastDate === today) {
        // Already did it today, maintain streak
      } else {
        const lastDateObj = new Date(lastDate);
        const diffTime = Math.abs(now.getTime() - lastDateObj.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
          triggerAnim = true;
        } else if (diffDays > 1) {
          newStreak = 1;
          triggerAnim = true;
        }
      }

      setProgress(p => ({ 
        ...p, 
        score: p.score + (isNewCompletion ? 50 : 5),
        completedLevels: isNewCompletion ? [...p.completedLevels, activeLevel.id] : p.completedLevels,
        streak: newStreak,
        lastCompletionDate: today
      }));

      if (triggerAnim) {
        setShowStreak(true);
        playStreakSound();
      }

      setView('path');
      setActiveLevel(null);
    }
  };

  const handleOnboardingComplete = (prefs: any) => {
    setProgress(p => ({ ...p, onboardingDone: true, preferences: prefs }));
    setView('home');
  };

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {showStreak && <StreakOverlay count={progress.streak} onClose={() => setShowStreak(false)} />}
      
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">F</div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none">Fikrliy</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-orange-50 border-2 border-orange-100 px-4 py-1.5 rounded-full items-center gap-2 shadow-sm">
            <span className="text-orange-500 font-bold">🔥</span>
            <span className="font-black text-orange-700">{progress.streak}</span>
          </div>
          <div className="bg-white border-2 border-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <span className="text-amber-500 font-bold">★</span>
            <span className="font-black text-slate-700">{progress.score}</span>
          </div>
          <Mascot mood="curious" size="sm" />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6">
        {view === 'home' && (
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Qaysi olamga sayohat qilamiz?</h2>
              <p className="text-xl text-slate-500 font-medium">Donish bilan birga STEM olamini kashf eting.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {COURSES.map(course => (
                <div 
                  key={course.id} 
                  onClick={() => handleCourseClick(course)} 
                  className={`bg-white p-8 rounded-[3rem] border-2 transition-all cursor-pointer shadow-xl hover:-translate-y-2 flex flex-col items-center text-center space-y-6 ${course.isComingSoon ? 'opacity-50 grayscale' : 'hover:border-indigo-500'}`}
                >
                  <div className="text-6xl">{course.icon}</div>
                  <div>
                    <h3 className="text-2xl font-black mb-2">{course.title}</h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">{course.description}</p>
                  </div>
                  {!course.isComingSoon && <div className="text-indigo-600 font-black text-sm uppercase tracking-widest">Boshlash →</div>}
                  {course.isComingSoon && <div className="text-slate-400 font-black text-xs uppercase tracking-widest">Tez Kunda</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'path' && activeCourse && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-6 mb-12">
               <button onClick={() => setView('home')} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 font-bold shadow-sm hover:text-indigo-600">←</button>
               <h1 className="text-3xl font-black text-slate-900">{activeCourse.title} Yo'li</h1>
            </div>
            
            <PathMap 
              sections={activeCourse.worlds.map(w => ({
                id: w.id,
                title: w.title,
                icon: w.icon,
                subTopics: w.modules.flatMap(m => m.levels)
              }))} 
              completedSubTopics={progress.completedLevels} 
              onSelectSubTopic={(st: any) => startLevel(st as Level)}
            />
          </div>
        )}

        {view === 'question' && activeLevel && currentQuestion && (
          <QuestionView 
            question={currentQuestion} 
            onCorrect={handleNext}
            onExit={() => setView('path')}
            currentStep={activeQuestionIdx + (activeStepIdx * activeLevel.steps[0].questions.length)}
            totalSteps={activeLevel.steps.reduce((acc, s) => acc + s.questions.length, 0)}
          />
        )}

        {view === 'coming-soon' && (
          <div className="py-24 flex flex-col items-center text-center space-y-10">
             <Mascot mood="thinking" size="lg" className="animate-bounce" />
             <h1 className="text-5xl font-black">Bu bo'lim hali yopiq</h1>
             <p className="text-xl text-slate-500 max-w-xl">Donish bu dunyo naqshlarini hali yakunlamadi. Tez kunda kashf etamiz!</p>
             <button onClick={() => setView('home')} className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-xl">Orqaga qaytish</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
