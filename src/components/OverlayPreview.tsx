import React from 'react';
import { Monitor } from 'lucide-react';
import { Character, OverlayConfig, WOW_CLASS_COLORS } from '../types';

interface OverlayPreviewProps {
  character: Character | null;
  config: OverlayConfig;
  error: string | null;
}

export function OverlayPreview({ character, config, error }: OverlayPreviewProps) {
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-400" />
          Overlay Preview
        </h2>
        <div className="bg-red-900/20 border border-red-800 rounded-md p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-400" />
          Overlay Preview
        </h2>
        <div className="bg-gray-700 rounded-md p-8 text-center text-gray-400">
          Search for a character to see the overlay preview
        </div>
      </div>
    );
  }

  const currentScore = character.mythic_plus_scores_by_season?.[0]?.scores?.all || 0;
  const itemLevel = character.gear?.item_level_equipped || 0;
  const classColor = WOW_CLASS_COLORS[character.class] || '#FFFFFF';
  
  const getFontSize = () => {
    switch (config.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getTextColor = () => {
    if (config.colorScheme === 'class') return classColor;
    if (config.colorScheme === 'custom') return config.customColors.primary;
    return '#FFFFFF';
  };

  const getSecondaryColor = () => {
    if (config.colorScheme === 'custom') return config.customColors.secondary;
    return '#9CA3AF';
  };

  const getBackgroundStyle = () => {
    if (config.backgroundTransparent) return 'transparent';
    if (config.colorScheme === 'custom') return config.customColors.background;
    return 'rgba(17, 24, 39, 0.9)';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Monitor className="w-5 h-5 text-blue-400" />
        Overlay Preview
      </h2>

      <div className="bg-gray-900 rounded-md p-4 border-2 border-dashed border-gray-600">
        <div className="text-xs text-gray-400 mb-2">Preview (actual size may vary in OBS)</div>
        
        <div
          className={`rounded-md p-4 ${getFontSize()} ${config.layout === 'vertical' ? 'space-y-2' : 'flex items-center space-x-4'}`}
          style={{ 
            backgroundColor: getBackgroundStyle(),
            color: getTextColor()
          }}
        >
          {/* Character Avatar */}
          <div className="flex-shrink-0">
            <img
              src={character.thumbnail_url}
              alt={character.name}
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: classColor }}
            />
          </div>

          {/* Character Info */}
          <div className={`${config.layout === 'vertical' ? 'space-y-1' : 'flex-1'}`}>
            <div className={`font-bold ${config.layout === 'horizontal' ? 'text-lg' : ''}`}>
              {character.name}
              {config.showRealm && (
                <span style={{ color: getSecondaryColor() }}>
                  {' '}- {character.realm}
                </span>
              )}
            </div>
            
            <div style={{ color: getSecondaryColor() }}>
              {character.class} ({character.active_spec_name})
            </div>

            {currentScore > 0 && (
              <div className="font-semibold">
                Mythic+ Score: {Math.round(currentScore)}
              </div>
            )}

            <div className={`${config.layout === 'vertical' ? 'space-y-1' : 'flex gap-4'}`}>
              {config.showItemLevel && itemLevel > 0 && (
                <div style={{ color: getSecondaryColor() }}>
                  Item Level: {itemLevel}
                </div>
              )}

              {config.showGuild && character.guild && (
                <div style={{ color: getSecondaryColor() }}>
                  &lt;{character.guild.name}&gt;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        💡 This preview shows how your overlay will appear in OBS. The actual size will depend on your browser source dimensions.
      </div>
    </div>
  );
}