import { Character } from '../types';

const BASE_URL = 'https://raider.io/api/v1/characters/profile';

export async function fetchCharacter(
  region: string,
  realm: string,
  name: string
): Promise<Character> {
  const params = new URLSearchParams({
    region,
    realm,
    name,
    fields: 'mythic_plus_scores_by_season:current,gear,guild'
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Character not found. Please check the region, realm, and character name.');
    }
    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export function validateInput(region: string, realm: string, name: string): string | null {
  if (!region.trim()) return 'Region is required';
  if (!realm.trim()) return 'Realm is required';
  if (!name.trim()) return 'Character name is required';
  if (name.length < 2 || name.length > 12) return 'Character name must be 2-12 characters';
  if (!/^[a-zA-Z]+$/.test(name)) return 'Character name can only contain letters';
  return null;
}