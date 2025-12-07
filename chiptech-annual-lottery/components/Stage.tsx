import React, { useEffect, useState, useRef } from 'react';
import { PrizeConfig, PrizeLevel, Winner } from '../types';
import { DRAW_ORDER, PRIZE_CONFIGS, CANDIDATES_LIST } from '../constants';
import { CircuitBoard, Dna, Hexagon, Sparkles, Zap, CheckCircle2, Cpu } from 'lucide-react';

interface StageProps {
  currentConfig: PrizeConfig;
  isRolling: boolean;
  onToggle: () => void;
  isComplete: boolean;
  isLevelFull?: boolean;
  lastWinner: string | null;
  currentLevel: PrizeLevel;
  onChangeLevel: (level: PrizeLevel) => void;
  winners: Winner[]; // Need full history to dim out past winners
}

const Stage: React.FC<StageProps> = ({ 
  currentConfig, 
  isRolling, 
  onToggle, 
  isComplete,
  isLevelFull = false,
  lastWinner,
  currentLevel,
  onChangeLevel,
  winners
}) => {
  const [highlightedName, setHighlightedName] = useState<string | null>(null);
  
  // Create a set of past winners for O(1) lookup, excluding the one just drawn (lastWinner)
  // because we want the lastWinner to shine brightly, not dim out immediately.
  const pastWinnerNames = new Set(
    winners
      .filter(w => w.name !== lastWinner)
      .map(w => w.name)
  );

  // Navigation buttons (High to Low for display priority)
  const navLevels = [...DRAW_ORDER].reverse();

  // Animation Loop for the Grid
  useEffect(() => {
    let interval: number;

    if (isRolling) {
      // Filter out people who have already won (including past rounds)
      // We want the "current" to only jump between valid candidates
      const validCandidates = CANDIDATES_LIST.filter(name => 
        !winners.some(w => w.name === name)
      );

      if (validCandidates.length > 0) {
        interval = window.setInterval(() => {
          const randomIndex = Math.floor(Math.random() * validCandidates.length);
          setHighlightedName(validCandidates[randomIndex]);
        }, 50); // Speed of the "current"
      }
    } else if (lastWinner) {
      // If stopped and we have a winner, lock the highlight on them
      setHighlightedName(lastWinner);
    } else {
      setHighlightedName(null);
    }

    return () => clearInterval(interval);
  }, [isRolling, lastWinner, winners]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-4 md:p-8 z-10">
      
      {/* Level Selector Tabs */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 z-50 px-4">
        {navLevels.map((level) => {
          const config = PRIZE_CONFIGS[level];
          const isActive = currentLevel === level && !isComplete;
          
          return (
             <button
               key={level}
               onClick={() => onChangeLevel(level)}
               disabled={isRolling}
               className={`
                 relative px-3 py-1 md:px-4 md:py-2 rounded-t-lg border-t border-l border-r text-xs md:text-sm font-tech tracking-wider uppercase transition-all duration-300
                 ${isActive 
                   ? 'bg-slate-900 border-cyan-500 text-cyan-300 shadow-[0_-5px_15px_rgba(34,211,238,0.2)] translate-y-1' 
                   : 'bg-slate-950/50 border-slate-800 text-slate-600 hover:text-slate-400 translate-y-1'
                 }
                 ${isRolling ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
               `}
             >
               {config.label.split('-')[0].trim()}
             </button>
          );
        })}
      </div>

      {/* Header Info */}
      <div className="mb-4 md:mb-8 text-center relative z-20 mt-12 md:mt-0">
        <h1 className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-2 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] ${isComplete ? 'opacity-50' : 'opacity-100'}`}>
          {isComplete ? "SYSTEM SHUTDOWN" : currentConfig.label}
        </h1>
        
        {!isComplete && (
           <p className="text-slate-400 text-sm md:text-base flex items-center justify-center gap-2 font-mono">
             {isLevelFull ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={16} /> ZONE COMPLETED
                </span>
             ) : (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  SCANNING ARRAY...
                </>
             )}
           </p>
        )}
      </div>

      {/* THE CHIP GRID / TRANSISTOR ARRAY */}
      <div className="relative z-10 w-full max-w-5xl flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        
        {/* PCB Background Decoration */}
        <div className="absolute inset-0 bg-slate-900/40 border border-slate-700 rounded-xl backdrop-blur-sm shadow-2xl">
          {/* Corner screws */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner"></div>
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner"></div>
        </div>

        {/* The Grid */}
        <div className="relative grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3 p-4 md:p-8 w-full">
            {CANDIDATES_LIST.map((name, idx) => {
              const isPastWinner = pastWinnerNames.has(name);
              const isCurrentWinner = name === lastWinner && !isRolling;
              const isHighlighted = name === highlightedName; // Used for rolling animation

              // State logic
              let stateClass = "border-slate-800 bg-slate-900/50 text-slate-600 opacity-60"; // Default/Idle
              let glowEffect = "";

              if (isPastWinner) {
                // Burnt out / Already won previously
                stateClass = "border-slate-900 bg-black text-slate-800 shadow-inner grayscale"; 
              } else if (isCurrentWinner) {
                // THE WINNER (Just won)
                stateClass = "border-yellow-400 bg-yellow-950/80 text-yellow-300 scale-110 z-50 font-bold";
                glowEffect = "shadow-[0_0_30px_rgba(250,204,21,0.6),inset_0_0_10px_rgba(250,204,21,0.3)] animate-pulse";
              } else if (isHighlighted) {
                // The "Current" passing through
                stateClass = "border-cyan-400 bg-cyan-900/80 text-cyan-50 scale-105 z-40";
                glowEffect = "shadow-[0_0_15px_rgba(34,211,238,0.8)]";
              } else {
                 // Active candidate awaiting current
                 stateClass = "border-slate-700 bg-slate-800/80 text-slate-400 group hover:border-slate-600";
              }

              return (
                <div 
                  key={name}
                  className={`
                    relative h-12 md:h-16 rounded flex items-center justify-center border transition-all duration-100
                    ${stateClass} ${glowEffect}
                  `}
                >
                  {/* Internal Circuit Lines */}
                  {!isPastWinner && (
                    <>
                      <div className={`absolute top-1/2 left-0 w-1 h-0.5 ${isHighlighted || isCurrentWinner ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
                      <div className={`absolute top-1/2 right-0 w-1 h-0.5 ${isHighlighted || isCurrentWinner ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
                    </>
                  )}
                  
                  {/* Chip Icon / Text */}
                  <div className="flex flex-col items-center">
                    <span className={`text-xs md:text-sm md:font-medium tracking-widest ${isCurrentWinner ? 'font-black' : ''}`}>
                      {name}
                    </span>
                    {/* Small visual tech deco */}
                    <div className="flex gap-0.5 mt-1">
                       <div className={`w-0.5 h-0.5 rounded-full ${isHighlighted || isCurrentWinner ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
                       <div className={`w-0.5 h-0.5 rounded-full ${isHighlighted || isCurrentWinner ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
                       <div className={`w-0.5 h-0.5 rounded-full ${isHighlighted || isCurrentWinner ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
                    </div>
                  </div>

                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current opacity-50"></div>
                  <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current opacity-50"></div>
                </div>
              );
            })}
        </div>

        {/* Big Winner Overlay (Optional - floats over grid when won) */}
        {lastWinner && !isRolling && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
             <div className="bg-slate-950/80 backdrop-blur-sm absolute inset-0 animate-fadeIn"></div>
             <div className="relative bg-slate-900 border-2 border-yellow-500 p-8 md:p-12 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.5)] flex flex-col items-center gap-4 animate-zoomIn">
                <div className="absolute -top-6 bg-slate-900 px-4 py-1 border border-yellow-500 rounded-full text-yellow-500 font-tech text-sm uppercase tracking-wider flex items-center gap-2">
                   <Sparkles size={16} /> Circuit Completed
                </div>
                <div className="text-yellow-500 animate-pulse">
                  <Cpu size={64} />
                </div>
                <div className="text-4xl md:text-6xl font-black text-white font-tech tracking-tight">
                  {lastWinner}
                </div>
                <div className="text-slate-400 text-sm font-mono mt-2">
                   TARGET ACQUIRED // PRIZE: {currentConfig.label}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Control Button */}
      <div className="mt-8 relative z-50">
        {!isComplete && (
          <button
            onClick={onToggle}
            disabled={isLevelFull}
            className={`
              relative px-12 py-4 md:px-16 md:py-5 rounded bg-slate-900 border-2 
              transition-all duration-100 font-tech font-bold text-lg tracking-[0.2em]
              ${isLevelFull 
                ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                : isRolling 
                  ? 'border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:bg-rose-950 active:scale-95' 
                  : 'border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-950 active:scale-95 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
              }
            `}
          >
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-30">
               <div className="w-1 h-4 bg-current"></div>
               <div className="w-1 h-4 bg-current"></div>
            </div>
            <span className="flex items-center gap-3 relative z-10">
              {isRolling ? <Zap className="animate-bounce" /> : <CircuitBoard />}
              {isRolling ? "STOP SIGNAL" : isLevelFull ? "ZONE LOCKED" : "ACTIVATE"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Stage;