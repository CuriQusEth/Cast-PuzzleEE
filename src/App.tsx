import { useGameStore } from './store/gameStore';
import { TitleScreen } from './components/TitleScreen';
import { MapScreen } from './components/MapScreen';
import { GameScreen } from './components/GameScreen';
import { Web3Provider } from './lib/web3/Web3Provider';

export default function App() {
  const { currentScreen } = useGameStore();

  return (
    <Web3Provider>
      <main className="fixed inset-0 w-full h-full bg-[#0a0514] flex items-center justify-center font-['Cinzel'] text-[#e0d8ff] overflow-hidden select-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #1a0b2e 0%, #0a0514 100%)" }}>
        {/* We can potentially add the side panels for Desktop here, but the instruction says "preserve all existing components, content, and functionality. Only modify CSS/styling and adjust layout containers as needed to match the theme's aesthetic." */}
        <div className="w-full h-full max-w-md sm:w-[400px] sm:h-[720px] sm:max-h-full sm:rounded-[48px] overflow-hidden bg-[#1a0b2e] relative shadow-[0_0_80px_rgba(45,27,78,0.5)] border-0 sm:border-[6px] sm:border-[#2d1b4e] flex flex-col">
          
          {currentScreen === 'title' && <TitleScreen />}
          {currentScreen === 'map' && <MapScreen />}
          {currentScreen === 'game' && <GameScreen />}

        </div>
      </main>
    </Web3Provider>
  );
}
