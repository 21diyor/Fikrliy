
import React from 'react';
import { MascotMood } from '../types';

interface MascotProps {
  mood: MascotMood;
  size?: 'sm' | 'md' | 'lg';
  // Added className to props definition
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ mood, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40'
  };

  const getColors = () => {
    switch(mood) {
      case 'happy': return { eyes: '#10b981', ear: '#fef3c7', bg: '#ecfdf5' };
      case 'sad': return { eyes: '#64748b', ear: '#f1f5f9', bg: '#f8fafc' };
      case 'excited': return { eyes: '#6366f1', ear: '#e0e7ff', bg: '#eef2ff' };
      case 'thinking': return { eyes: '#f59e0b', ear: '#fff7ed', bg: '#fffbeb' };
      case 'curious': return { eyes: '#8b5cf6', ear: '#f5f3ff', bg: '#f5f3ff' };
      case 'confused': return { eyes: '#ef4444', ear: '#fef2f2', bg: '#fef2f2' };
      default: return { eyes: '#475569', ear: '#f8fafc', bg: 'white' };
    }
  };

  const colors = getColors();

  return (
    /* Added className to the wrapper div */
    <div className={`relative flex items-center justify-center ${sizeMap[size]} transition-all duration-500 ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        {/* Tail */}
        <path 
          d="M 140 160 Q 180 160 180 120 Q 180 100 160 100" 
          fill="none" 
          stroke="#cbd5e1" 
          strokeWidth="8" 
          strokeLinecap="round"
          className={`transition-transform duration-1000 origin-center ${mood === 'excited' ? 'animate-bounce' : 'animate-pulse'}`}
        />
        
        {/* Body */}
        <circle cx="100" cy="130" r="50" fill={colors.bg} />
        
        {/* Head */}
        <g className={`transition-transform duration-300 ${mood === 'thinking' ? '-rotate-6' : mood === 'curious' ? 'rotate-12' : 'rotate-0'}`}>
          <circle cx="100" cy="80" r="45" fill="white" stroke="#e2e8f0" strokeWidth="2" />
          
          {/* Do'ppi (Uzbek Cap) */}
          <path d="M 68 52 Q 100 28 132 52 L 128 62 L 72 62 Z" fill="#1e293b" />
          <path d="M 85 45 L 92 45 M 108 45 L 115 45" stroke="white" strokeWidth="1" opacity="0.4" />
          
          {/* Ears */}
          <path d="M 65 45 L 80 60 L 55 65 Z" fill={colors.ear} stroke="#e2e8f0" strokeWidth="2" />
          <path d="M 135 45 L 120 60 L 145 65 Z" fill={colors.ear} stroke="#e2e8f0" strokeWidth="2" />
          
          {/* Eyes */}
          <g className="transition-all duration-300">
            {mood === 'happy' || mood === 'excited' ? (
               <>
                 <path d="M 80 85 Q 90 75 100 85" fill="none" stroke={colors.eyes} strokeWidth="4" strokeLinecap="round" />
                 <path d="M 110 85 Q 120 75 130 85" fill="none" stroke={colors.eyes} strokeWidth="4" strokeLinecap="round" />
               </>
            ) : mood === 'confused' || mood === 'sad' ? (
               <>
                 <circle cx="90" cy="90" r="4" fill={colors.eyes} />
                 <circle cx="120" cy="90" r="4" fill={colors.eyes} />
                 <path d="M 85 82 L 95 85" stroke="#94a3b8" strokeWidth="2" />
                 <path d="M 125 82 L 115 85" stroke="#94a3b8" strokeWidth="2" />
               </>
            ) : (
               <>
                 <circle cx="90" cy="90" r="5" fill={colors.eyes} />
                 <circle cx="120" cy="90" r="5" fill={colors.eyes} />
               </>
            )}
          </g>

          {/* Nose */}
          <circle cx="105" cy="100" r="3" fill="#f43f5e" opacity="0.8" />
          
          {/* Whiskers */}
          <path d="M 80 100 L 60 98 M 80 105 L 60 110" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 130 100 L 150 98 M 130 105 L 150 110" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Mouth */}
          <path 
            d={mood === 'excited' ? "M 95 110 Q 105 125 115 110" : "M 95 110 Q 105 115 115 110"} 
            fill="none" 
            stroke="#475569" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
        </g>
      </svg>
    </div>
  );
};

export default Mascot;