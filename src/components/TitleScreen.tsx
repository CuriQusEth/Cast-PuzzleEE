import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { Sparkles, Play, Map as MapIcon } from 'lucide-react';

export function TitleScreen() {
  const { setCurrentScreen } = useGameStore();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Magic Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow-300/30 blur-sm"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center text-center p-8 bg-black/40 border border-white/5 backdrop-blur-md rounded-[48px]"
      >
        <Sparkles className="w-12 h-12 text-[#E8A020] mb-4" />
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-[#e0d8ff] via-[#E8A020] to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(232,160,32,0.3)]">
          CAST<br/>PUZZLE
        </h1>
        <p className="mt-4 text-[#e0d8ff] opacity-60 max-w-xs text-sm uppercase tracking-widest font-bold">
          Combine elements.<br/>Solve puzzles.<br/>Restore the realm.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('map')}
          className="mt-12 px-8 py-4 bg-[#E8A020] rounded-xl font-bold uppercase tracking-widest text-black shadow-[0_4px_20px_rgba(232,160,32,0.3)] flex items-center gap-2 transition-transform hover:scale-[0.98]"
        >
          <Play className="w-5 h-5 fill-current" />
          Begin Journey
        </motion.button>
      </motion.div>
    </div>
  );
}
