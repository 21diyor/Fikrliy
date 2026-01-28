
import React, { useState, useEffect, useCallback } from 'react';
import Mascot from './Mascot';

/**
 * Template A: Drag & Drop Collector
 * User drags items from a tray into a container.
 */
export const DragDropCollector: React.FC<{ 
  target: number; 
  itemEmoji: string; 
  containerLabel: string;
  onDiscover: (count: number) => void;
}> = ({ target, itemEmoji, containerLabel, onDiscover }) => {
  const [inContainer, setInContainer] = useState<number>(0);
  const trayItems = 10;

  const addToContainer = () => {
    if (inContainer < trayItems) setInContainer(prev => prev + 1);
  };

  const removeFromContainer = () => {
    if (inContainer > 0) setInContainer(prev => prev - 1);
  };

  useEffect(() => {
    onDiscover(inContainer);
  }, [inContainer, onDiscover]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-2xl bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
      {/* Tray */}
      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 w-full md:w-1/3">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Zaxira</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: trayItems - inContainer }).map((_, i) => (
            <button 
              key={i} 
              onClick={addToContainer}
              className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-transform"
            >
              {itemEmoji}
            </button>
          ))}
        </div>
      </div>

      {/* Target Container */}
      <div className="flex-1 flex flex-col items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-dashed border-indigo-100 relative min-h-[200px]">
        <p className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">{containerLabel}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: inContainer }).map((_, i) => (
            <button 
              key={i} 
              onClick={removeFromContainer}
              className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl animate-in zoom-in-50 hover:bg-rose-50 transition-colors"
            >
              {itemEmoji}
            </button>
          ))}
          {inContainer === 0 && <span className="text-slate-200 font-bold italic py-8 text-sm">Bo'sh...</span>}
        </div>
        
        <div className="absolute bottom-4 right-6 text-3xl font-black text-slate-200">
          {inContainer}
        </div>
      </div>
    </div>
  );
};

/**
 * Template B: Balance Scale Solver
 * User balances items on a scale.
 */
export const BalanceScale: React.FC<{
  leftWeight: number;
  rightInitial: number;
  onDiscover: (totalRight: number) => void;
}> = ({ leftWeight, rightInitial, onDiscover }) => {
  const [added, setAdded] = useState<number>(0);
  const totalRight = rightInitial + added;
  const tilt = (leftWeight - totalRight) * 2;

  useEffect(() => {
    onDiscover(totalRight);
  }, [totalRight, onDiscover]);

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-md p-10 bg-white rounded-[4rem] border border-slate-100 shadow-sm">
      <div className="relative w-full h-48 flex flex-col items-center justify-end">
        <div className="w-10 h-32 bg-slate-100 rounded-t-full" />
        <div className="absolute bottom-32 w-full h-2 bg-slate-400 rounded-full transition-transform duration-700" style={{ transform: `rotate(${tilt}deg)` }}>
          {/* Left Pan */}
          <div className="absolute -left-4 -top-12 w-20 h-16 bg-slate-50 border-b-4 border-slate-200 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-xl font-black text-slate-400">{leftWeight}</span>
          </div>
          {/* Right Pan */}
          <div className="absolute -right-4 -top-12 w-20 h-16 bg-white border-b-4 border-indigo-300 rounded-full flex flex-col items-center justify-center shadow-lg">
            <span className={`text-xl font-black ${totalRight === leftWeight ? 'text-emerald-500' : 'text-indigo-600'}`}>{totalRight}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {[1, 5, 10].map(v => (
          <button key={v} onClick={() => setAdded(a => a + v)} className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-black hover:bg-indigo-600 hover:text-white transition-all">
            +{v}
          </button>
        ))}
        <button onClick={() => setAdded(0)} className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 font-black text-[10px] hover:bg-rose-500 hover:text-white transition-all">
          QAYTA
        </button>
      </div>
    </div>
  );
};

/**
 * Template C: Grid/Tile Builder
 * User places tiles on a grid to match constraints.
 */
export const GridBuilder: React.FC<{
  rows: number;
  cols: number;
  onDiscover: (count: number, grid: boolean[][]) => void;
}> = ({ rows, cols, onDiscover }) => {
  const [grid, setGrid] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(false))
  );

  const toggle = (r: number, c: number) => {
    const next = [...grid.map(row => [...row])];
    next[r][c] = !next[r][c];
    setGrid(next);
    
    const count = next.flat().filter(Boolean).length;
    onDiscover(count, next);
  };

  return (
    <div className="bg-[#fdfbf7] p-8 rounded-[3rem] border-4 border-white shadow-inner">
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {grid.map((row, r) => row.map((filled, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => toggle(r, c)}
            className={`w-12 h-12 rounded-xl transition-all duration-300 ${
              filled ? 'bg-indigo-600 scale-100 shadow-lg' : 'bg-white border-2 border-amber-100 hover:border-amber-300'
            }`}
          >
            {filled && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 rounded-full" />
              </div>
            )}
          </button>
        )))}
      </div>
      <div className="mt-8 flex justify-center">
        <div className="px-6 py-2 bg-white rounded-full border border-amber-100 text-amber-900 font-black text-sm">
          {grid.flat().filter(Boolean).length} / {rows * cols}
        </div>
      </div>
    </div>
  );
};

/**
 * Template E: Transform (Mirror/Rotate)
 * User replicates a pattern symmetrically.
 */
export const TransformGrid: React.FC<{
  type: 'mirror' | 'rotate';
  sourcePattern: boolean[][];
  onDiscover: (userPattern: boolean[][]) => void;
}> = ({ type, sourcePattern, onDiscover }) => {
  const rows = sourcePattern.length;
  const cols = sourcePattern[0].length;
  const [userPattern, setUserPattern] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(false))
  );

  const toggle = (r: number, c: number) => {
    const next = [...userPattern.map(row => [...row])];
    next[r][c] = !next[r][c];
    setUserPattern(next);
    onDiscover(next);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-slate-50/50 rounded-[3rem]">
      {/* Source */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 opacity-60">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {sourcePattern.map((row, r) => row.map((f, c) => (
            <div key={`${r}-${c}`} className={`w-8 h-8 rounded-md ${f ? 'bg-slate-400' : 'bg-slate-50'}`} />
          )))}
        </div>
      </div>

      {/* Axis/Icon */}
      <div className="text-4xl text-slate-300">
        {type === 'mirror' ? '┃' : '↺'}
      </div>

      {/* User Interaction */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {userPattern.map((row, r) => row.map((filled, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => toggle(r, c)}
              className={`w-12 h-12 rounded-xl border-2 transition-all ${
                filled ? 'bg-indigo-500 border-indigo-600 scale-100' : 'bg-white border-slate-100 hover:border-indigo-200'
              }`}
            />
          )))}
        </div>
      </div>
    </div>
  );
};
