import React, { useState } from 'react';
import { Code, Copy, Check, Download } from 'lucide-react';
import { Character, OverlayConfig, WOW_CLASS_COLORS } from '../types';

interface EmbedCodeGeneratorProps {
  character: Character | null;
  config: OverlayConfig;
}

export function EmbedCodeGenerator({ character, config }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    if (!character) return '';

    const classColor = WOW_CLASS_COLORS[character.class] || '#FFFFFF';
    const currentScore = character.mythic_plus_scores_by_season?.[0]?.scores?.all || 0;
    const itemLevel = character.gear?.item_level_equipped || 0;

    const getFontSize = () => {
      switch (config.fontSize) {
        case 'small': return '14px';
        case 'large': return '18px';
        default: return '16px';
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

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WoW Character Overlay - ${character.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: transparent;
            overflow: hidden;
            padding: 16px;
        }

        .overlay-container {
            font-size: ${getFontSize()};
            color: ${getTextColor()};
            background: ${getBackgroundStyle()};
            border-radius: 8px;
            display: ${config.layout === 'vertical' ? 'block' : 'flex'};
            align-items: ${config.layout === 'horizontal' ? 'center' : 'flex-start'};
            gap: ${config.layout === 'horizontal' ? '16px' : '8px'};
            width: fit-content;
            max-width: 400px;
            padding: 16px;
        }

        .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid ${classColor};
            flex-shrink: 0;
        }

        .character-info {
            ${config.layout === 'vertical' ? 'margin-top: 8px;' : 'flex: 1;'}
        }

        .character-name {
            font-weight: bold;
            ${config.layout === 'horizontal' ? 'font-size: 1.125em;' : ''}
            margin-bottom: 2px;
        }

        .character-details {
            color: ${getSecondaryColor()};
            margin-bottom: 4px;
        }

        .mythic-score {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .additional-info {
            ${config.layout === 'vertical' ? 'margin-top: 4px;' : 'display: flex; gap: 16px;'}
            color: ${getSecondaryColor()};
        }

        .additional-info > div {
            ${config.layout === 'vertical' ? 'margin-bottom: 2px;' : ''}
        }

        .error {
            color: #EF4444;
            padding: 16px;
            background: rgba(239, 68, 68, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .loading {
            color: ${getTextColor()};
            padding: 16px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="overlay">
        <div class="loading">Loading character data...</div>
    </div>

    <script>
        const API_BASE = 'https://raider.io/api/v1/characters/profile';
        const CHARACTER_DATA = {
            region: '${character.region}',
            realm: '${character.realm}',
            name: '${character.name}'
        };

        const WOW_CLASS_COLORS = {
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
            'Warrior': '#C69B6D'
        };

        async function fetchCharacterData() {
            try {
                const params = new URLSearchParams({
                    region: CHARACTER_DATA.region,
                    realm: CHARACTER_DATA.realm,
                    name: CHARACTER_DATA.name,
                    fields: 'mythic_plus_scores_by_season:current,gear,guild'
                });

                const response = await fetch(API_BASE + '?' + params.toString());
                if (!response.ok) throw new Error('Character not found');
                
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch character data:', error);
                return null;
            }
        }

        function renderOverlay(character) {
            const overlay = document.getElementById('overlay');
            
            if (!character) {
                overlay.innerHTML = '<div class="error">Unable to load character data. Please check your internet connection.</div>';
                return;
            }

            const currentScore = character.mythic_plus_scores_by_season && character.mythic_plus_scores_by_season[0] ? character.mythic_plus_scores_by_season[0].scores.all : 0;
            const itemLevel = character.gear ? character.gear.item_level_equipped : 0;
            const classColor = WOW_CLASS_COLORS[character.class] || '#FFFFFF';

            let characterNameHtml = character.name;
            if (${config.showRealm}) {
                characterNameHtml += ' <span style="color: ${getSecondaryColor()}">- ' + character.realm + '</span>';
            }

            let mythicScoreHtml = '';
            if (currentScore > 0) {
                mythicScoreHtml = '<div class="mythic-score">Mythic+ Score: ' + Math.round(currentScore) + '</div>';
            }

            let additionalInfoHtml = '';
            const additionalItems = [];
            
            if (${config.showItemLevel} && itemLevel > 0) {
                additionalItems.push('<div>Item Level: ' + itemLevel + '</div>');
            }
            
            if (${config.showGuild} && character.guild) {
                additionalItems.push('<div><' + character.guild.name + '></div>');
            }

            if (additionalItems.length > 0) {
                additionalInfoHtml = '<div class="additional-info">' + additionalItems.join('') + '</div>';
            }

            overlay.innerHTML = 
                '<div class="overlay-container">' +
                    '<img src="' + character.thumbnail_url + '" alt="' + character.name + '" class="avatar" />' +
                    '<div class="character-info">' +
                        '<div class="character-name">' + characterNameHtml + '</div>' +
                        '<div class="character-details">' + character.class + ' (' + character.active_spec_name + ')</div>' +
                        mythicScoreHtml +
                        additionalInfoHtml +
                    '</div>' +
                '</div>';
        }

        async function updateOverlay() {
            const character = await fetchCharacterData();
            renderOverlay(character);
        }

        // Initial load
        updateOverlay();

        // Auto-refresh every 30 minutes
        setInterval(updateOverlay, 30 * 60 * 1000);

        // Refresh when page becomes visible (useful for OBS)
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                updateOverlay();
            }
        });
    </script>
</body>
</html>`;
  };

  const handleCopy = async () => {
    if (!character) return;

    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!character) return;

    const code = generateEmbedCode();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wow-overlay-${character.name.toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!character) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-400" />
          Embed Code
        </h2>
        <div className="bg-gray-700 rounded-md p-4 text-center text-gray-400">
          Search for a character to generate embed code
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-blue-400" />
        Embed Code
      </h2>

      <div className="space-y-4">
        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-md p-4 text-blue-200 text-sm">
          <div className="font-medium mb-2">📺 How to use in OBS:</div>
          <ol className="list-decimal list-inside space-y-1">
            <li>Copy the HTML code below or download the file</li>
            <li>Save it as a .html file on your computer</li>
            <li>In OBS, add a "Browser Source"</li>
            <li>Check "Local File" and select your HTML file</li>
            <li>Set width: 400px, height: 150px (adjust as needed)</li>
            <li>Check "Shutdown source when not visible" and "Refresh browser when scene becomes active"</li>
          </ol>
        </div>

        {/* Code Display */}
        <div className="relative">
          <pre className="bg-gray-900 border border-gray-600 rounded-md p-4 text-sm text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
            <code>{generateEmbedCode()}</code>
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        <div className="text-xs text-gray-400">
          💡 The overlay will automatically refresh every 30 minutes to show updated character data.
        </div>
      </div>
    </div>
  );
}