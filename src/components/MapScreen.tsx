import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { Lock, Star, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { GameButton } from './GameButton';

export function MapScreen() {
  const { unlockedLevels, setCurrentLevel, setCurrentScreen, totalStars } = useGameStore();

  const levels = [
    { id: 1, name: 'The Awakening', x: 20, y: 80 },
    { id: 2, name: 'Scorched Path', x: 50, y: 70 },
    { id: 3, name: 'River Crossing', x: 80, y: 50 },
    { id: 4, name: 'Windy Peak', x: 60, y: 20 },
    { id: 5, name: 'Mastery', x: 20, y: 30 },
  ];

  return (
    <div className="w-full h-full p-6 flex flex-col relative bg-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <button 
          onClick={() => setCurrentScreen('title')}
          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
          <Star className="w-4 h-4 text-[#E8A020] fill-[#E8A020]" />
          <span className="font-bold">{totalStars}</span>
        </div>
      </div>

      <div className="flex justify-end mt-4 z-10 w-full relative">
         <GameButton />
      </div>

      {/* Map Content */}
      <div className="flex-1 relative mt-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <path 
            d="M 20% 80% L 50% 70% L 80% 50% L 60% 20% L 20% 30%" 
            fill="none" 
            stroke="#E8A020" 
            strokeWidth="4" 
            strokeDasharray="8 8"
          />
        </svg>

        {levels.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          
          return (
            <motion.div
              key={level.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${level.x}%`, top: `${level.y}%` }}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
            >
              <button
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentLevel(level.id);
                    setCurrentScreen('game');
                  }
                }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                  isUnlocked 
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                    : "bg-black/40 border-white/5 opacity-50"
                )}
              >
                {isUnlocked ? (
                  <span className="font-bold text-lg">{level.id}</span>
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </button>
              <div className="mt-2 text-xs bg-black/40 px-2 py-1 rounded text-white/60 backdrop-blur-sm whitespace-nowrap border border-white/5">
                {level.name}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
