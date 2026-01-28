
import React, { useState, useEffect, useRef, useMemo } from 'react';

export type GeometryTemplate = 'rotate' | 'mirror' | 'match' | 'measure' | 'build';

interface Point { x: number; y: number; }
interface Shape { type: 'poly' | 'line'; points: Point[]; color?: string; id: string; }

interface GeometryBoardProps {
  template: GeometryTemplate;
  config: any;
  onDiscover: (success: boolean, data: any) => void;
  playSound?: (type: string) => void;
}

const GeometryBoard: React.FC<GeometryBoardProps> = ({ template, config, onDiscover, playSound }) => {
  const gridSize = config.gridSize || 8;
  const cellSize = 40;
  const boardSize = gridSize * cellSize;
  
  const [userPoints, setUserPoints] = useState<Point[]>(config.initialPoints || []);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [interacted, setInteracted] = useState(false);

  // Derived metrics
  const perimeter = useMemo(() => {
    if (userPoints.length < 2) return 0;
    let p = 0;
    for (let i = 0; i < userPoints.length; i++) {
      const p1 = userPoints[i];
      const p2 = userPoints[(i + 1) % userPoints.length];
      p += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    return Math.round(p);
  }, [userPoints]);

  const area = useMemo(() => {
    if (userPoints.length < 3) return 0;
    let a = 0;
    for (let i = 0; i < userPoints.length; i++) {
      const p1 = userPoints[i];
      const p2 = userPoints[(i + 1) % userPoints.length];
      a += (p1.x * p2.y - p2.x * p1.y);
    }
    return Math.abs(a / 2);
  }, [userPoints]);

  // Handle Logic Checks
  useEffect(() => {
    if (!interacted || typeof onDiscover !== 'function') return;
    
    let success = false;
    switch (template) {
      case 'rotate':
        success = (rotation % 360) === (config.targetRotation % 360);
        break;
      case 'mirror':
        // Check if user points are reflected version of config.sourcePoints (Order Independent)
        if (userPoints.length === config.sourcePoints.length) {
          const targetPoints = config.sourcePoints.map((p: Point) => ({
            x: gridSize - 1 - p.x,
            y: p.y
          }));
          
          success = targetPoints.every((tp: Point) => 
            userPoints.some(up => up.x === tp.x && up.y === tp.y)
          );
        }
        break;
      case 'build':
        if (config.targetArea) success = area === config.targetArea;
        if (config.targetPerimeter) success = Math.abs(perimeter - config.targetPerimeter) < 0.1;
        if (config.targetPoints) success = userPoints.length === config.targetPoints;
        break;
      case 'match':
        const dx = Math.abs(offset.x - config.targetOffset.x);
        const dy = Math.abs(offset.y - config.targetOffset.y);
        success = dx < 0.2 && dy < 0.2;
        break;
      case 'measure':
        success = interacted; // Logic handled in QuestionView choice usually
        break;
    }
    onDiscover(success, { perimeter, area, rotation, offset, points: userPoints });
  }, [rotation, offset, userPoints, interacted, onDiscover, config, gridSize, template, perimeter, area]);

  const handleCellClick = (x: number, y: number) => {
    setInteracted(true);
    if (template === 'mirror' || template === 'build') {
      const exists = userPoints.find(p => p.x === x && p.y === y);
      if (exists) {
        setUserPoints(prev => prev.filter(p => p !== exists));
        playSound?.('tap_select');
      } else {
        setUserPoints(prev => [...prev, { x, y }]);
        playSound?.('snap_drop');
      }
    }
  };

  const rotate = (dir: number) => {
    setInteracted(true);
    setRotation(r => r + dir);
    playSound?.('rotate_tick');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl">
      {/* Metrics Row */}
      <div className="flex gap-4 w-full justify-center">
        {(template === 'build' || template === 'measure') && (
          <>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">Perimetr</span>
              <span className="text-lg font-black text-indigo-600">{perimeter}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">Yuza</span>
              <span className="text-lg font-black text-emerald-600">{area}</span>
            </div>
          </>
        )}
        {template === 'rotate' && (
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase">Burchak</span>
            <span className="text-lg font-black text-amber-500">{rotation}°</span>
          </div>
        )}
      </div>

      {/* The Board */}
      <div 
        className="relative bg-white rounded-[2.5rem] border-4 border-slate-100 shadow-2xl overflow-hidden touch-none"
        style={{ width: boardSize, height: boardSize }}
      >
        {/* Grid Lines */}
        <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-20">
          <defs>
            <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="gray" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {template === 'mirror' && (
            <line x1={boardSize/2} y1="0" x2={boardSize/2} y2={boardSize} stroke="#6366f1" strokeWidth="4" strokeDasharray="8,4" />
          )}
        </svg>

        {/* Interaction Layer */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const x = i % gridSize;
            const y = Math.floor(i / gridSize);
            const isFilled = userPoints.some(p => p.x === x && p.y === y);
            const isSource = config.sourcePoints?.some((p: any) => p.x === x && p.y === y);
            const isGhost = config.ghostPoints?.some((p: any) => p.x === x && p.y === y);

            return (
              <div 
                key={i}
                onClick={() => handleCellClick(x, y)}
                className={`w-full h-full border-[0.5px] border-slate-50 flex items-center justify-center transition-all cursor-crosshair
                  ${isFilled ? 'bg-indigo-500 shadow-inner scale-90 rounded-lg' : 'hover:bg-slate-50'}
                  ${isSource ? 'bg-slate-200' : ''}
                  ${isGhost ? 'bg-indigo-100/30 border-2 border-dashed border-indigo-200' : ''}
                `}
              >
                {isSource && <div className="w-2 h-2 rounded-full bg-slate-400" />}
              </div>
            );
          })}
        </div>

        {/* Floating Shapes Layer (for Match/Rotate) */}
        {(template === 'rotate' || template === 'match') && (
          <div 
            className="absolute inset-0 pointer-events-none flex items-center justify-center transition-transform duration-500 ease-out"
            style={{ 
              transform: `rotate(${rotation}deg) translate(${offset.x * cellSize}px, ${offset.y * cellSize}px)`,
            }}
          >
             <div className="w-32 h-32 bg-indigo-500/80 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                <div className="w-12 h-12 border-4 border-white/40 rounded-full" />
             </div>
          </div>
        )}

        {/* Target Outline Layer */}
        {template === 'match' && (
           <div 
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{ transform: `translate(${config.targetOffset.x * cellSize}px, ${config.targetOffset.y * cellSize}px)` }}
          >
             <div className="w-32 h-32 border-4 border-dashed border-slate-200 rounded-2xl" />
          </div>
        )}
      </div>

      {/* Tools Row */}
      <div className="flex gap-4">
        {template === 'rotate' && (
          <>
            <button onClick={() => rotate(-90)} className="w-14 h-14 bg-white border border-slate-100 rounded-2xl shadow-sm text-2xl hover:bg-slate-50">↺</button>
            <button onClick={() => rotate(90)} className="w-14 h-14 bg-white border border-slate-100 rounded-2xl shadow-sm text-2xl hover:bg-slate-50">↻</button>
          </>
        )}
        {template === 'match' && (
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button onClick={() => { setOffset(o => ({...o, y: o.y - 1})); setInteracted(true); playSound?.('select'); }} className="w-12 h-12 bg-white border rounded-xl shadow-sm">↑</button>
            <div />
            <button onClick={() => { setOffset(o => ({...o, x: o.x - 1})); setInteracted(true); playSound?.('select'); }} className="w-12 h-12 bg-white border rounded-xl shadow-sm">←</button>
            <button onClick={() => { setOffset(o => ({...o, y: o.y + 1})); setInteracted(true); playSound?.('select'); }} className="w-12 h-12 bg-white border rounded-xl shadow-sm">↓</button>
            <button onClick={() => { setOffset(o => ({...o, x: o.x + 1})); setInteracted(true); playSound?.('select'); }} className="w-12 h-12 bg-white border rounded-xl shadow-sm">→</button>
          </div>
        )}
        <button 
          onClick={() => {
            setUserPoints(config.initialPoints || []);
            setRotation(0);
            setOffset({ x: 0, y: 0 });
            setInteracted(false);
            playSound?.('submit');
          }} 
          className="px-6 py-2 bg-rose-50 text-rose-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-rose-100"
        >
          Qaytadan
        </button>
      </div>
    </div>
  );
};

export default GeometryBoard;
