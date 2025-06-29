import React, { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';
import { Character, OverlayConfig } from './types';
import { CharacterLookup } from './components/CharacterLookup';
import { OverlayPreview } from './components/OverlayPreview';
import { CustomizationPanel } from './components/CustomizationPanel';
import { EmbedCodeGenerator } from './components/EmbedCodeGenerator';
import { fetchCharacter } from './utils/api';
import { getOverlayConfig, saveOverlayConfig } from './utils/localStorage';

function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [config, setConfig] = useState<OverlayConfig>(getOverlayConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveOverlayConfig(config);
  }, [config]);

  const handleSearch = async (region: string, realm: string, name: string) => {
    setIsLoading(true);
    setError(null);
    setCharacter(null);

    try {
      const characterData = await fetchCharacter(region, realm, name);
      setCharacter(characterData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left side - Main title and description */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  WoW Mythic+ OBS Overlay Generator
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Create customizable character overlays for your World of Warcraft streams
                </p>
              </div>
            </div>

            {/* Right side - Bolt badge */}
            <div className="flex-shrink-0">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2"
                aria-label="Powered by Bolt"
              >
                <img
                  src="/white_circle_360x360.svg"
                  alt="Bolt"
                  className="w-[6vw] h-[6vw] max-h-[85px] max-w-[85px] hover:scale-105 transition-transform duration-200"
                />                
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Character Lookup */}
          <CharacterLookup onSearch={handleSearch} isLoading={isLoading} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <OverlayPreview character={character} config={config} error={error} />
              <CustomizationPanel config={config} onChange={setConfig} />
            </div>

            {/* Right Column */}
            <div>
              <EmbedCodeGenerator character={character} config={config} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>
              Powered by the{' '}
              <a
                href="https://raider.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Raider.IO API
              </a>
              {' '}• Built for World of Warcraft streamers and content creators
            </p>
            <p className="mt-2">
              Not affiliated with Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;