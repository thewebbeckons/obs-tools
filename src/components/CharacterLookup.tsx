import React, { useState } from 'react';
import { Search, Clock, ChevronDown } from 'lucide-react';
import { REGIONS } from '../types';
import { validateInput } from '../utils/api';
import { getSearchHistory, addToSearchHistory } from '../utils/localStorage';

interface CharacterLookupProps {
  onSearch: (region: string, realm: string, name: string) => void;
  isLoading: boolean;
}

export function CharacterLookup({ onSearch, isLoading }: CharacterLookupProps) {
  const [region, setRegion] = useState('us');
  const [realm, setRealm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const searchHistory = getSearchHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateInput(region, realm, name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    addToSearchHistory({ region, realm, name });
    onSearch(region, realm, name);
  };

  const handleHistorySelect = (entry: typeof searchHistory[0]) => {
    setRegion(entry.region);
    setRealm(entry.realm);
    setName(entry.name);
    setShowHistory(false);
    setError(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-400" />
        Character Lookup
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Region
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                disabled={isLoading}
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Realm
            </label>
            <input
              type="text"
              value={realm}
              onChange={(e) => setRealm(e.target.value)}
              placeholder="e.g., Stormrage"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Thrall"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-md p-3">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Character
              </>
            )}
          </button>

          {searchHistory.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                History
              </button>

              {showHistory && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {searchHistory.map((entry, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistorySelect(entry)}
                        className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-xs text-gray-500">
                          {entry.realm} ({entry.region.toUpperCase()})
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}