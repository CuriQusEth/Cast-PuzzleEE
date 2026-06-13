import { create } from 'zustand';

export type Screen = 'title' | 'map' | 'game' | 'spellbook' | 'leaderboard';
export type ElementType = 'fire' | 'water' | 'earth' | 'wind';

export type SpellType = 
  | 'fireball'      // fire
  | 'splash'        // water
  | 'rock'          // earth
  | 'gust'          // wind
  | 'fireTornado'   // fire + wind
  | 'healingVine'   // water + earth
  | 'lavaBridge'    // fire + earth
  | 'icePlatform'   // water + wind
  | 'steamCloud'    // fire + water
  | 'sandstorm';    // earth + wind

interface GameState {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  // Level Management
  currentLevel: number;
  unlockedLevels: number[];
  setCurrentLevel: (level: number) => void;
  unlockLevel: (level: number) => void;
  
  // Active Game State
  mana: number;
  maxMana: number;
  spendMana: (amount: number) => void;
  restoreMana: (amount: number) => void;
  
  // Spell Casting
  selectedElements: ElementType[];
  selectElement: (element: ElementType) => void;
  clearElements: () => void;
  castSpell: () => SpellType | null;

  // On-chain stats
  totalStars: number;
  addStars: (stars: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'title',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  currentLevel: 1,
  unlockedLevels: [1],
  setCurrentLevel: (level) => set({ currentLevel: level }),
  unlockLevel: (level) => set((state) => ({ 
    unlockedLevels: state.unlockedLevels.includes(level) 
      ? state.unlockedLevels 
      : [...state.unlockedLevels, level] 
  })),

  mana: 10,
  maxMana: 10,
  spendMana: (amount) => set((state) => ({ mana: Math.max(0, state.mana - amount) })),
  restoreMana: (amount) => set((state) => ({ mana: Math.min(state.maxMana, state.mana + amount) })),

  selectedElements: [],
  selectElement: (element) => set((state) => {
    if (state.selectedElements.length >= 2) return state;
    return { selectedElements: [...state.selectedElements, element] };
  }),
  clearElements: () => set({ selectedElements: [] }),
  
  castSpell: () => {
    const { selectedElements } = get();
    if (selectedElements.length === 0) return null;
    
    // Logic to determine spell
    let spell: SpellType | null = null;
    if (selectedElements.length === 1) {
      const e = selectedElements[0];
      if (e === 'fire') spell = 'fireball';
      if (e === 'water') spell = 'splash';
      if (e === 'earth') spell = 'rock';
      if (e === 'wind') spell = 'gust';
    } else if (selectedElements.length === 2) {
      const combo = [...selectedElements].sort().join('+');
      switch (combo) {
        case 'fire+wind': spell = 'fireTornado'; break;
        case 'earth+water': spell = 'healingVine'; break;
        case 'earth+fire': spell = 'lavaBridge'; break;
        case 'water+wind': spell = 'icePlatform'; break;
        case 'fire+water': spell = 'steamCloud'; break;
        case 'earth+wind': spell = 'sandstorm'; break;
      }
    }
    
    // Reset selection after cast (mana spent elsewhere)
    set({ selectedElements: [] });
    return spell;
  },

  totalStars: 0,
  addStars: (stars) => set((state) => ({ totalStars: state.totalStars + stars })),
}));
