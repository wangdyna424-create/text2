import React from 'react';
import { PrizeLevel, Winner, PrizeConfig } from '../types';
import { PRIZE_CONFIGS, DRAW_ORDER } from '../constants';
import { Trophy, Medal, Cpu, Zap, Microchip } from 'lucide-react';

interface PrizeListProps {
  winners: Winner[];
  currentLevel: PrizeLevel;
}

const Icons: Record<string, React.FC<any>> = {
  cpu: Cpu,
  microchip: Microchip,
  zap: Zap,
  award: Trophy
};

const PrizeList: React.FC<PrizeListProps> = ({ winners, currentLevel }) => {
  // We want to display prizes in reverse order (Grand at top)
  const displayOrder = [...DRAW_ORDER].reverse();

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-md border-l border-slate-700 shadow-2xl overflow-hidden relative z-10">
      <div className="p-6 border-b border-slate-700 bg-slate-900">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 font-tech tracking-wider">
          <Medal className="text-yellow-500" />
          获奖名人堂
        </h2>
        <p className="text-xs text-slate-400 mt-1">HALL OF FAME</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {displayOrder.map((level) => {
          const config = PRIZE_CONFIGS[level];
          const levelWinners = winners.filter((w) => w.level === level);
          const Icon = Icons[config.icon] || Trophy;
          const isCurrent = currentLevel === level;

          return (
            <div 
              key={level} 
              className={`rounded-lg border ${isCurrent ? 'border-cyan-500/50 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/50'} transition-all duration-500`}
            >
              <div className="p-3 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={config.color} />
                  <span className={`text-sm font-bold ${config.color} font-tech`}>
                    {config.label}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {levelWinners.length}/{config.count}
                </span>
              </div>
              
              <div className="p-2 grid grid-cols-2 gap-2">
                {levelWinners.length === 0 ? (
                  <div className="col-span-2 text-center py-4 text-slate-700 text-xs italic">
                    待揭晓 / PENDING...
                  </div>
                ) : (
                  levelWinners.map((winner, idx) => (
                    <div 
                      key={`${winner.name}-${idx}`}
                      className="bg-slate-800/80 p-2 rounded text-center text-sm font-medium text-white shadow-sm border border-slate-700 animate-fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {winner.name}
                    </div>
                  ))
                )}
                {/* Placeholders for remaining slots */}
                {Array.from({ length: Math.max(0, config.count - levelWinners.length) }).map((_, i) => (
                   <div key={`empty-${i}`} className="h-9 rounded border border-dashed border-slate-800 bg-slate-900/30"></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrizeList;