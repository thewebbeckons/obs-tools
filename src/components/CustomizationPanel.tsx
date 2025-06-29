import React from 'react';
import { Settings, Palette, Monitor, Eye, EyeOff } from 'lucide-react';
import { OverlayConfig } from '../types';

interface CustomizationPanelProps {
  config: OverlayConfig;
  onChange: (config: OverlayConfig) => void;
}

export function CustomizationPanel({ config, onChange }: CustomizationPanelProps) {
  const updateConfig = (updates: Partial<OverlayConfig>) => {
    onChange({ ...config, ...updates });
  };

  const updateCustomColors = (colorKey: keyof OverlayConfig['customColors'], value: string) => {
    onChange({
      ...config,
      customColors: {
        ...config.customColors,
        [colorKey]: value
      }
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-400" />
        Customization
      </h2>

      <div className="space-y-6">
        {/* Background & Transparency */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Background
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.backgroundTransparent}
              onChange={(e) => updateConfig({ backgroundTransparent: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-gray-300">Transparent background</span>
          </label>
        </div>

        {/* Font Size */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Font Size</h3>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateConfig({ fontSize: size })}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  config.fontSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Scheme
          </h3>
          <div className="space-y-2">
            {([
              { value: 'class', label: 'WoW Class Colors' },
              { value: 'minimal', label: 'Minimal (Black & White)' },
              { value: 'custom', label: 'Custom Colors' }
            ] as const).map((scheme) => (
              <label key={scheme.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="colorScheme"
                  value={scheme.value}
                  checked={config.colorScheme === scheme.value}
                  onChange={(e) => updateConfig({ colorScheme: e.target.value as any })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">{scheme.label}</span>
              </label>
            ))}
          </div>

          {/* Custom Color Inputs */}
          {config.colorScheme === 'custom' && (
            <div className="mt-4 space-y-3 p-3 bg-gray-700 rounded-md">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Primary</label>
                  <input
                    type="color"
                    value={config.customColors.primary}
                    onChange={(e) => updateCustomColors('primary', e.target.value)}
                    className="w-full h-8 bg-gray-600 border border-gray-500 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Secondary</label>
                  <input
                    type="color"
                    value={config.customColors.secondary}
                    onChange={(e) => updateCustomColors('secondary', e.target.value)}
                    className="w-full h-8 bg-gray-600 border border-gray-500 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Background
                    {config.backgroundTransparent && (
                      <span className="text-gray-500 ml-1">(disabled)</span>
                    )}
                  </label>
                  <input
                    type="color"
                    value={config.customColors.background}
                    onChange={(e) => updateCustomColors('background', e.target.value)}
                    className={`w-full h-8 bg-gray-600 border border-gray-500 rounded ${
                      config.backgroundTransparent 
                        ? 'cursor-not-allowed opacity-50' 
                        : 'cursor-pointer'
                    }`}
                    disabled={config.backgroundTransparent}
                  />
                  {config.backgroundTransparent && (
                    <div className="text-xs text-gray-500 mt-1">
                      Uncheck "Transparent background" to customize background color
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Layout */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Layout</h3>
          <div className="flex gap-2">
            {(['horizontal', 'vertical'] as const).map((layout) => (
              <button
                key={layout}
                onClick={() => updateConfig({ layout })}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  config.layout === layout
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {layout.charAt(0).toUpperCase() + layout.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Show/Hide Elements
          </h3>
          <div className="space-y-2">
            {([
              { key: 'showRealm', label: 'Realm Name' },
              { key: 'showGuild', label: 'Guild Name' },
              { key: 'showItemLevel', label: 'Item Level' }
            ] as const).map((option) => (
              <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config[option.key]}
                  onChange={(e) => updateConfig({ [option.key]: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}