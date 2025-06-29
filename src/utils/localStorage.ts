import { SearchEntry, OverlayConfig } from '../types';

const SEARCH_HISTORY_KEY = 'wow-overlay-search-history';
const OVERLAY_CONFIG_KEY = 'wow-overlay-config';
const MAX_HISTORY_ITEMS = 10;

export function getSearchHistory(): SearchEntry[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(entry: Omit<SearchEntry, 'timestamp'>): void {
  try {
    const history = getSearchHistory();
    const newEntry: SearchEntry = { ...entry, timestamp: Date.now() };
    
    // Remove duplicate if exists
    const filtered = history.filter(
      item => !(item.region === entry.region && item.realm === entry.realm && item.name === entry.name)
    );
    
    // Add new entry to beginning and limit size
    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function getOverlayConfig(): OverlayConfig {
  try {
    const stored = localStorage.getItem(OVERLAY_CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to default
  }
  
  return {
    backgroundTransparent: true,
    fontSize: 'medium',
    colorScheme: 'class',
    layout: 'horizontal',
    showGuild: true,
    showItemLevel: true,
    showRealm: true,
    customColors: {
      primary: '#3B82F6',
      secondary: '#1F2937',
      background: '#111827',
    },
  };
}

export function saveOverlayConfig(config: OverlayConfig): void {
  try {
    localStorage.setItem(OVERLAY_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // Silently fail if localStorage is not available
  }
}