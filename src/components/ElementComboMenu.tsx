import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ElementType } from '../store/gameStore';
import { Flame, Droplet, Mountain, Wind, X } from 'lucide-react';

interface ElementComboProps {
  selectedElements: ElementType[];
  onSelect: (el: ElementType) => void;
  onClear: () => void;
  onCast: () => void;
  disabled?: boolean;
}

const ELEMENT_ICONS: Record<ElementType, React.ElementType> = {
  fire: Flame,
  water: Droplet,
  earth: Mountain,
  wind: Wind
};

export function ElementComboMenu({ selectedElements, onSelect, onClear, onCast, disabled }: ElementComboProps) {
  
  const elements: ElementType[] = ['fire', 'water', 'earth', 'wind'];

  const getElementStyle = (el: ElementType) => {
    switch(el) {
      case 'fire': return 'bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
      case 'water': return 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'earth': return 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      case 'wind': return 'bg-white/10 border-white/50 text-white/80 shadow-[0_0_10px_rgba(255,255,255,0.2)]';
    }
  };

  return (
    <div className="bg-black/40 border-t border-white/5 p-8 flex flex-col gap-6 safe-area-pb sm:rounded-b-[42px]">
      <div className="flex justify-between items-center mb-0 px-2">
        <h3 className="text-xs uppercase tracking-widest opacity-60 font-bold">SPELL WEAVING</h3>
        <button 
          onClick={onClear}
          disabled={selectedElements.length === 0}
          className="opacity-60 hover:opacity-100 disabled:opacity-30 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Slot Visualization */}
      <div className="flex justify-center gap-4 h-12">
        {[0, 1].map((slot) => {
          const el = selectedElements[slot];
          const Icon = el ? ELEMENT_ICONS[el] : null;

          return (
            <div 
              key={slot} 
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all bg-black/40",
                el ? "border-transparent" : "border-white/10 border-dashed"
              )}
            >
              <AnimatePresence mode="popLayout">
                {el && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border",
                      getElementStyle(el),
                      "border opacity-100 bg-opacity-30" 
                    )}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Element Buttons */}
      <div className="flex justify-center gap-4">
        {elements.map((el) => {
          const Icon = ELEMENT_ICONS[el];
          return (
            <motion.button
              key={el}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(el)}
              disabled={disabled || selectedElements.length >= 2}
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                getElementStyle(el),
                "hover:brightness-125 disabled:opacity-30 disabled:cursor-not-allowed",
                selectedElements.includes(el) ? "ring-2 ring-white/50" : ""
              )}
            >
               <Icon className="w-6 h-6" />
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onCast}
        disabled={selectedElements.length === 0 || disabled}
        className={cn(
          "w-full py-4 text-black font-bold uppercase tracking-widest rounded-xl transition-all",
          selectedElements.length > 0
            ? "bg-[#E8A020] shadow-[0_4px_20px_rgba(232,160,32,0.3)] hover:scale-[0.98]"
            : "bg-white/10 text-white/40 cursor-not-allowed"
        )}
      >
        CAST SPELL
      </button>

    </div>
  );
}
