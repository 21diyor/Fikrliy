
import React, { useState } from 'react';
import Mascot from './Mascot';

interface OnboardingProps {
  onComplete: (prefs: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({
    goal: '',
    focus: '',
    time: '',
    level: ''
  });

  const steps = [
    {
      title: "Assalomu alaykum! Ismim Donish.",
      question: "Fikrliy platformasiga nima uchun keldingiz?",
      key: 'goal',
      options: [
        { label: "Maktabda yordam", val: "school", icon: "🏫" },
        { label: "Mantiqiy fikrlash uchun", val: "logic", icon: "🧠" },
        { label: "Geometriya va naqshlar", val: "visual", icon: "🎨" },
        { label: "Shunchaki qiziqish", val: "curiosity", icon: "✨" }
      ]
    },
    {
      title: "Vaqtingiz qadrli.",
      question: "Kunda necha daqiqa shug'ullana olasiz?",
      key: 'time',
      options: [
        { label: "5 daqiqa", val: "5", icon: "⚡" },
        { label: "15 daqiqa", val: "15", icon: "🔥" },
        { label: "30 daqiqa", val: "30", icon: "🏆" }
      ]
    },
    {
      title: "Keling, darajangizni aniqlaymiz.",
      question: "Matematika bilan munosabatingiz qanday?",
      key: 'level',
      options: [
        { label: "Hali o'rganyapman", val: "beginner", icon: "🌱" },
        { label: "O'rtacha, tushunaman", val: "medium", icon: "🌿" },
        { label: "Men uchun oson", val: "expert", icon: "🌳" }
      ]
    }
  ];

  const handleSelect = (val: string) => {
    const currentKey = steps[step].key;
    const newPrefs = { ...prefs, [currentKey]: val };
    setPrefs(newPrefs);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newPrefs);
    }
  };

  const current = steps[step];

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[4rem] p-12 shadow-2xl space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-6">
          <Mascot mood="happy" size="lg" className="animate-float" />
          <div className="space-y-2">
            <h2 className="text-xl font-black text-indigo-500 uppercase tracking-widest">{current.title}</h2>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">{current.question}</h1>
          </div>
        </div>

        <div className="grid gap-4">
          {current.options.map(opt => (
            <button 
              key={opt.val}
              onClick={() => handleSelect(opt.val)}
              className="p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] flex items-center gap-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
            >
              <span className="text-4xl group-hover:scale-125 transition-transform">{opt.icon}</span>
              <span className="text-xl font-black text-slate-700">{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
