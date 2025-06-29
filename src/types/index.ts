export interface Character {
  name: string;
  race: string;
  class: string;
  active_spec_name: string;
  active_spec_role: string;
  level: number;
  realm: string;
  region: string;
  faction: string;
  achievement_points: number;
  honorable_kills: number;
  thumbnail_url: string;
  profile_url: string;
  profile_banner: string;
  mythic_plus_scores_by_season?: Array<{
    season: string;
    scores: {
      all: number;
      dps: number;
      healer: number;
      tank: number;
      spec_0: number;
      spec_1: number;
      spec_2: number;
      spec_3: number;
    };
  }>;
  gear?: {
    item_level_equipped: number;
    item_level_total: number;
    artifact_traits: number;
  };
  guild?: {
    name: string;
    realm: string;
  };
}

export interface OverlayConfig {
  backgroundTransparent: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'class' | 'custom' | 'minimal';
  layout: 'horizontal' | 'vertical';
  showGuild: boolean;
  showItemLevel: boolean;
  showRealm: boolean;
  customColors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export interface SearchEntry {
  region: string;
  realm: string;
  name: string;
  timestamp: number;
}

export const REGIONS = [
  { value: 'us', label: 'US' },
  { value: 'eu', label: 'EU' },
  { value: 'kr', label: 'KR' },
  { value: 'tw', label: 'TW' },
];

export const WOW_CLASS_COLORS: Record<string, string> = {
  'Death Knight': '#C41E3A',
  'Demon Hunter': '#A330C9',
  'Druid': '#FF7C0A',
  'Evoker': '#33937F',
  'Hunter': '#AAD372',
  'Mage': '#3FC7EB',
  'Monk': '#00FF98',
  'Paladin': '#F48CBA',
  'Priest': '#FFFFFF',
  'Rogue': '#FFF468',
  'Shaman': '#0070DD',
  'Warlock': '#8788EE',
  'Warrior': '#C69B6D',
};