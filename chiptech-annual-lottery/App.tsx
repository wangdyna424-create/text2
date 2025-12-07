import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CANDIDATES_LIST, DRAW_ORDER, PRIZE_CONFIGS } from './constants';
import { PrizeLevel, Winner } from './types';
import ChipBackground from './components/ChipBackground';
import PrizeList from './components/PrizeList';
import Stage from './components/Stage';

// Helper to get a random item that is NOT in the ignore list
const getRandomName = (candidates: string[]) => {
  if (candidates.length === 0) return "---";
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
};

const App: React.FC = () => {
  // --- State ---
  const [remainingCandidates, setRemainingCandidates] = useState<string[]>(CANDIDATES_LIST);
  const [winners, setWinners] = useState<Winner[]>([]);
  
  // Controls the current prize level we are drawing for
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  
  // Animation state
  const [isRolling, setIsRolling] = useState(false);
  
  // We don't use simple setInterval for rolling name in App anymore, 
  // Stage handles the visual grid animation.
  // We just handle logic here.
  
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const lastWinnerRef = useRef<string | null>(null);

  const currentLevel = DRAW_ORDER[currentLevelIdx] || PrizeLevel.Grand; // Fallback for out of bounds
  const currentConfig = PRIZE_CONFIGS[currentLevel];

  // Calculated properties
  const isAllComplete = currentLevelIdx >= DRAW_ORDER.length;
  
  // When looking at a specific level, is it full?
  const currentLevelWinners = winners.filter(w => w.level === currentLevel);
  const isCurrentLevelFull = currentLevelWinners.length >= currentConfig.count;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // The Rolling Logic
  const startRolling = useCallback(() => {
    if (remainingCandidates.length === 0) return;
    setIsRolling(true);
    lastWinnerRef.current = null;
    
    // Clear any pending auto-advance if user starts rolling manually
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, [remainingCandidates]);

  const stopRolling = useCallback(() => {
    setIsRolling(false);

    let winnerName = "";
    const targetGrandWinner = "王泽巨";

    // --- RIGGED LOGIC START ---
    if (currentLevel === PrizeLevel.Grand) {
      // It's Grand Prize time. Force Wang Zeju.
      // We check if he's available just to be robust, but we force him regardless
      // to meet the requirement "Must draw Wang Zeju".
      winnerName = targetGrandWinner;
    } else {
      // For other prizes, try to preserve Wang Zeju for the end.
      // Filter him out of the random selection pool for lower prizes.
      const poolWithoutTarget = remainingCandidates.filter(name => name !== targetGrandWinner);
      
      if (poolWithoutTarget.length > 0) {
        winnerName = getRandomName(poolWithoutTarget);
      } else {
        // If he is the ONLY one left, he has to win this one.
        winnerName = getRandomName(remainingCandidates);
      }
    }
    // --- RIGGED LOGIC END ---

    lastWinnerRef.current = winnerName;

    // Update state
    const newWinner: Winner = {
      name: winnerName,
      level: currentLevel,
      timestamp: Date.now()
    };

    setWinners(prev => {
      const nextWinners = [...prev, newWinner];
      
      // Check for auto-advance logic here based on the NEW state
      const countForLevel = nextWinners.filter(w => w.level === currentLevel).length;
      
      if (countForLevel >= currentConfig.count) {
        // Level is full. Schedule advance if not the very last state.
        // We use a timeout to show the winner for a moment.
        autoAdvanceTimerRef.current = window.setTimeout(() => {
           setCurrentLevelIdx(prev => {
             // Only advance if we are still on the same level (user didn't manually switch)
             return prev + 1;
           });
           lastWinnerRef.current = null;
        }, 4000); // Increased delay to enjoy the big popup
      }

      return nextWinners;
    });

    setRemainingCandidates(prev => prev.filter(name => name !== winnerName));

  }, [remainingCandidates, currentLevel, currentConfig]);

  const handleToggle = () => {
    if (isAllComplete) return;

    if (isRolling) {
      stopRolling();
    } else {
      // Don't start if this level is already full
      if (isCurrentLevelFull) return;
      startRolling();
    }
  };

  const handleManualLevelChange = (level: PrizeLevel) => {
    if (isRolling) return; // Prevent switching while rolling
    
    // Cancel any pending auto-advance
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    const idx = DRAW_ORDER.indexOf(level);
    if (idx !== -1) {
      setCurrentLevelIdx(idx);
      lastWinnerRef.current = null;
    }
  };

  // Keyboard shortcut (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        handleToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggle]); 

  return (
    <div className="flex w-full h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans select-none">
      <ChipBackground />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        <Stage 
          currentConfig={isAllComplete ? PRIZE_CONFIGS[PrizeLevel.Grand] : currentConfig}
          isRolling={isRolling}
          onToggle={handleToggle}
          isComplete={isAllComplete}
          isLevelFull={isCurrentLevelFull && !isAllComplete}
          lastWinner={lastWinnerRef.current}
          currentLevel={isAllComplete ? PrizeLevel.Grand : currentLevel}
          onChangeLevel={handleManualLevelChange}
          winners={winners}
        />
      </main>

      {/* Sidebar */}
      <aside className="w-80 md:w-96 flex-shrink-0 h-full border-l border-slate-800 relative z-20">
        <PrizeList 
          winners={winners} 
          currentLevel={isAllComplete ? PrizeLevel.Grand : currentLevel} 
        />
      </aside>
    </div>
  );
};

export default App;