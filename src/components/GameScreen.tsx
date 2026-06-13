import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore, SpellType } from '../store/gameStore';
import { LEVELS, LevelData, TileType, Entity } from '../lib/game/levels';
import { ElementComboMenu } from './ElementComboMenu';
import { ChevronLeft, RotateCcw, AlertTriangle, Zap, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { GameButton } from './GameButton';

export function GameScreen() {
  const { 
    currentLevel, setCurrentScreen, mana, maxMana, spendMana, restoreMana, 
    selectedElements, selectElement, clearElements, castSpell,
    addStars, unlockLevel
  } = useGameStore();

  const [levelData, setLevelData] = useState<LevelData>(LEVELS[currentLevel]);
  const [grid, setGrid] = useState<TileType[][]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [readySpell, setReadySpell] = useState<SpellType | null>(null);
  const [castsUsed, setCastsUsed] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);

  // Initialize level
  useEffect(() => {
    const data = LEVELS[currentLevel];
    if (data) {
      setLevelData(data);
      // Deep copy grid
      setGrid(data.grid.map(row => [...row]));
      setEntities(JSON.parse(JSON.stringify(data.initialEntities)));
      useGameStore.setState({ mana: data.startMana, maxMana: data.startMana });
      setCastsUsed(0);
      setLevelComplete(false);
      setReadySpell(null);
    }
  }, [currentLevel]);

  const player = entities.find(e => e.type === 'player');

  const handleTileTap = (x: number, y: number) => {
    if (levelComplete || !player) return;

    if (readySpell) {
      executeSpell(x, y, readySpell);
      setReadySpell(null);
      return;
    }

    // Move player if adjacent
    const dx = Math.abs(player.x - x);
    const dy = Math.abs(player.y - y);
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      const tile = grid[y][x];
      // Check block
      const hasBox = entities.find(e => e.type === 'box' && e.x === x && e.y === y);
      
      if (!hasBox && (tile === 'empty' || tile === 'ice' || tile === 'burnt' || tile === 'goal')) {
        // Move
        const newEntities = [...entities];
        const pIdx = newEntities.findIndex(e => e.id === 'p1');
        newEntities[pIdx] = { ...newEntities[pIdx], x, y };
        setEntities(newEntities);
        
        if (tile === 'goal') {
          handleWin();
        }
      } else if (hasBox) {
         // Box push logic - push in same direction if empty
         const pushX = x + (x - player.x);
         const pushY = y + (y - player.y);
         const pushTile = grid[pushY]?.[pushX];
         const hasBoxDest = entities.find(e => e.type === 'box' && e.x === pushX && e.y === pushY);
         
         if (!hasBoxDest && (pushTile === 'empty' || pushTile === 'ice' || pushTile === 'burnt')) {
            const newEntities = [...entities];
            const bIdx = newEntities.findIndex(e => e.id === hasBox.id);
            const pIdx = newEntities.findIndex(e => e.id === 'p1');
            
            newEntities[bIdx] = { ...newEntities[bIdx], x: pushX, y: pushY };
            newEntities[pIdx] = { ...newEntities[pIdx], x, y };
            setEntities(newEntities);
         }
      }
    }
  };

  const executeSpell = (targetX: number, targetY: number, spell: SpellType) => {
    const tile = grid[targetY]?.[targetX];
    const newGrid = [...grid];
    
    let cost = 1;

    if (spell === 'fireball') {
      if (tile === 'brambles') {
        newGrid[targetY][targetX] = 'burnt';
      }
    } else if (spell === 'icePlatform') {
       cost = 2;
       if (tile === 'water') {
         newGrid[targetY][targetX] = 'ice';
       }
    }
    
    if (mana >= cost) {
       setGrid(newGrid);
       spendMana(cost);
       setCastsUsed(c => c + 1);
    }
  };

  const handleWin = () => {
    setLevelComplete(true);
    let stars = 1;
    if (castsUsed <= levelData.targetStars[3]) stars = 3;
    else if (castsUsed <= levelData.targetStars[2]) stars = 2;
    
    addStars(stars);
    unlockLevel(currentLevel + 1);
  };

  const onCastClick = () => {
    const spell = castSpell();
    if (spell) setReadySpell(spell);
  };

  if (!levelData || grid.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      {/* Header */}
      <div className="p-8 flex items-center justify-between z-10 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex flex-col">
          <button 
            onClick={() => setCurrentScreen('map')}
            className="text-[10px] uppercase tracking-widest opacity-60 flex items-center hover:opacity-100 mb-1"
          >
            <ChevronLeft className="w-3 h-3 mr-1" />
            BACK TO MAP
          </button>
          <span className="text-lg font-bold">Level {currentLevel}</span>
        </div>
        <button 
          onClick={() => {
             // Reset
             const data = LEVELS[currentLevel];
             setGrid(data.grid.map(row => [...row]));
             setEntities(JSON.parse(JSON.stringify(data.initialEntities)));
             useGameStore.setState({ mana: data.startMana });
             setCastsUsed(0);
             setReadySpell(null);
          }}
          className="opacity-60 hover:opacity-100"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Resource HUD */}
      <div className="flex px-6 py-2 justify-center gap-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <div className="w-32 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300"
               style={{ width: `${(mana / maxMana) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-white/50">{mana}/{maxMana}</span>
        </div>
      </div>

      {/* Info message */}
      <div className="text-center h-6 text-sm text-[#E8A020]">
         {readySpell && "Tap a tile to cast spell..."}
      </div>

      {/* Grid Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative inline-block overflow-hidden"
          style={{
             display: 'grid',
             gridTemplateColumns: `repeat(${grid[0].length}, 48px)`,
             gridTemplateRows: `repeat(${grid.length}, 48px)`,
             gap: '8px'
          }}
        >
          {grid.map((row, y) => 
            row.map((tile, x) => (
              <div 
                key={`${x}-${y}`}
                onClick={() => handleTileTap(x, y)}
                className={cn(
                  "w-12 h-12 flex items-center justify-center relative cursor-pointer rounded-lg border",
                  tile === 'wall' && "bg-white/5 border-white/5",
                  tile === 'empty' && "bg-white/5 border-white/5  hover:bg-white/10 transition-colors",
                  tile === 'water' && "bg-blue-500/30 border-blue-400/40",
                  tile === 'ice' && "bg-cyan-200/40 border-cyan-100/50 backdrop-blur-sm",
                  tile === 'brambles' && "bg-emerald-500/20 border-emerald-500/40",
                  tile === 'burnt' && "bg-red-500/20 border-red-500/40",
                  tile === 'goal' && "bg-[#E8A020]/20 border-[#E8A020]/40",
                  readySpell && "hover:bg-purple-500/20 hover:border-purple-500/40"
                )}
              >
                 {tile === 'goal' && <Star className="w-5 h-5 text-[#E8A020] fill-[#E8A020] animate-pulse" />}
              </div>
            ))
          )}

          {/* Render Entities */}
          {entities.map(ent => (
            <motion.div
              key={ent.id}
              initial={false}
              animate={{ x: ent.x * 56, y: ent.y * 56 }} // 48px + 8px gap
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute w-12 h-12 flex items-center justify-center pointer-events-none"
            >
              {ent.type === 'player' && (
                <div className="w-10 h-10 bg-white/10 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center text-xl">
                   🧙
                </div>
              )}
              {ent.type === 'box' && (
                <div className="w-10 h-10 bg-orange-900/50 rounded-lg border border-orange-500/30 flex items-center justify-center">
                  <div className="w-4 h-4 border border-orange-500/50" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Spell Menu Input */}
      <div className="shrink-0 z-20">
        <ElementComboMenu 
          selectedElements={selectedElements}
          onSelect={selectElement}
          onClear={clearElements}
          onCast={onCastClick}
          disabled={readySpell !== null}
        />
      </div>

      {/* Level Complete Overlay */}
      <AnimatePresence>
        {levelComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a0b2e] border border-[#2d1b4e] shadow-[0_0_80px_rgba(45,27,78,0.8)] p-8 rounded-[48px] w-full max-w-sm flex flex-col items-center relative overflow-hidden"
            >
               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-orange-400 to-[#E8A020]" />
               <h2 className="text-3xl font-bold mb-2 text-center">LEVEL CLEARED</h2>
               <p className="opacity-60 text-sm mb-6 text-center">
                 Casts: {castsUsed} | Target: {levelData.targetStars[3]}
               </p>

               <div className="flex gap-2 mb-8">
                 {[1, 2, 3].map(s => {
                    const earned = castsUsed <= (levelData.targetStars[s as keyof typeof levelData.targetStars] || 99);
                    return (
                      <Star 
                        key={s} 
                        className={cn("w-10 h-10 transition-all duration-500", earned ? "text-[#E8A020] fill-[#E8A020]" : "text-white/20")} 
                      />
                    );
                 })}
               </div>

               <div className="flex flex-col w-full gap-3">
                  <GameButton />
                  <button 
                    onClick={async () => {
                      try {
                         // Mock SIWE logic, just an alert for demonstration without backend
                         alert(`Signing SIWE for Score: ${castsUsed} casts. Requires standard backend validation.`);
                      } catch (e) {
                         console.error(e);
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest"
                  >
                     <span>📜</span> RECORD SCORE
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('map')}
                    className="w-full py-3 rounded-xl bg-[#E8A020] text-black hover:scale-[0.98] transition-transform font-bold uppercase tracking-widest"
                  >
                     Continue Journey
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
