
import React from 'react';
import { Section, SubTopic } from '../types';

interface PathMapProps {
  sections: Section[];
  completedSubTopics: string[];
  onSelectSubTopic: (st: SubTopic) => void;
}

const PathMap: React.FC<PathMapProps> = ({ sections, completedSubTopics, onSelectSubTopic }) => {
  // Flatten all subtopics to find the strictly current active one
  const allSubTopics = sections.flatMap(s => s.subTopics);
  const firstIncompleteIdx = allSubTopics.findIndex(st => !completedSubTopics.includes(st.id));
  const activeSubTopicId = firstIncompleteIdx !== -1 ? allSubTopics[firstIncompleteIdx].id : null;

  return (
    <div className="flex flex-col items-center py-12 pb-32 space-y-32 max-w-2xl mx-auto px-4">
      {sections.map((section, sIdx) => {
        // A section is locked if the previous section isn't finished
        const previousSection = sections[sIdx - 1];
        const isPreviousSectionFinished = !previousSection || 
          previousSection.subTopics.every(st => completedSubTopics.includes(st.id));

        return (
          <div key={section.id} className="w-full flex flex-col items-center">
            {/* Section Header Card */}
            <div className={`w-full max-w-md bg-white border-2 rounded-3xl p-6 mb-16 shadow-sm text-center relative z-10 transition-all duration-500 ${isPreviousSectionFinished ? 'border-slate-100 opacity-100' : 'border-slate-50 opacity-40 grayscale'}`}>
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em] mb-1">
                {sIdx + 1}-BOB
              </div>
              <div className="text-xl font-black text-slate-800 tracking-tight">
                {section.title}
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-20 w-full relative">
              {section.subTopics.map((st, stIdx) => {
                const isCompleted = completedSubTopics.includes(st.id);
                const isActive = st.id === activeSubTopicId;
                const isLocked = !isCompleted && !isActive;
                
                // Snaking Pattern: Center, Rightish, Center, Leftish
                const offsets = [
                  'translate-x-0', 
                  'translate-x-12 md:translate-x-20', 
                  'translate-x-0', 
                  '-translate-x-12 md:-translate-x-20'
                ];
                const offsetClass = offsets[stIdx % 4];

                return (
                  <div key={st.id} className={`relative flex flex-col items-center group transition-all duration-700 ease-out ${offsetClass}`}>
                    
                    {/* Vertical Connector Path */}
                    {stIdx < section.subTopics.length - 1 && (
                      <div className="absolute top-16 w-1.5 h-28 -z-10 bg-slate-100">
                        <div 
                          className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]`} 
                          style={{ height: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    )}

                    {/* Platform Base Node */}
                    <div className="relative">
                      {/* Active Label Badge */}
                      {isActive && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-indigo-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-bounce shadow-xl shadow-indigo-200 z-20">
                          BOSHLASH
                        </div>
                      )}
                      
                      <button
                        onClick={() => !isLocked && onSelectSubTopic(st)}
                        disabled={isLocked}
                        className={`
                          path-platform
                          ${isCompleted ? 'path-platform-completed scale-100' : 
                            isActive ? 'path-platform-active scale-110 hover:scale-125' : 
                            'path-platform-locked scale-90'}
                          active:translate-y-2 active:shadow-none transition-all duration-500
                        `}
                      >
                        <div className={`
                          w-12 h-12 flex items-center justify-center text-3xl transition-all duration-300
                          ${isCompleted ? 'text-white' : isActive ? 'text-indigo-600' : 'text-slate-300'}
                          ${isLocked ? 'grayscale' : ''}
                        `}>
                          {isCompleted ? '✓' : section.icon}
                        </div>
                      </button>
                    </div>
                    
                    {/* Lesson Title */}
                    <div className="mt-8 max-w-[150px] text-center">
                      <div className={`font-black text-sm leading-tight transition-all duration-500 ${isLocked ? 'text-slate-300' : 'text-slate-700'}`}>
                        {st.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Section Bridge (Link between chapters) */}
            {sIdx < sections.length - 1 && (
               <div className="w-1.5 h-24 mt-20 bg-slate-100 relative">
                  <div 
                    className="absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-1000"
                    style={{ height: section.subTopics.every(st => completedSubTopics.includes(st.id)) ? '100%' : '0%' }}
                  />
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PathMap;
