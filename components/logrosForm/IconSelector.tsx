
//components\logrosForm\IconSelector.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { 
  Gauge, Trophy, Star, Lock, Unlock, Medal, 
  Rocket, Target, CheckCircle, Code, Globe, 
  Database, Shield, Swords, Search, X,
  // Íconos adicionales
  Zap, Heart, Crown, Diamond, Brain, 
  Flame,  Award,  Sparkles,
  Gem, Sword, Book, Compass, Map,
  Mountain, Sun, Moon,  Lightbulb,
  Flag, Crosshair, Eye, Gift
} from 'lucide-react';

const icons = [
  { icon: Gauge, name: 'Gauge' },
  { icon: Trophy, name: 'Trophy' },
  { icon: Star, name: 'Star' },
  { icon: Lock, name: 'Lock' },
  { icon: Unlock, name: 'Unlock' },
  { icon: Medal, name: 'Medal' },
  { icon: Rocket, name: 'Rocket' },
  { icon: Target, name: 'Target' },
  { icon: CheckCircle, name: 'CheckCircle' },
  { icon: Code, name: 'Code' },
  { icon: Globe, name: 'Globe' },
  { icon: Database, name: 'Database' },
  { icon: Shield, name: 'Shield' },
  { icon: Swords, name: 'Swords' },
  // Íconos adicionales
  { icon: Zap, name: 'Zap' },
  { icon: Heart, name: 'Heart' },
  { icon: Crown, name: 'Crown' },
  { icon: Diamond, name: 'Diamond' },
  { icon: Brain, name: 'Brain' },
  { icon: Flame, name: 'Flame' },
  { icon: Award, name: 'Award' },
  { icon: Sparkles, name: 'Sparkles' },
  { icon: Gem, name: 'Gem' },
  { icon: Sword, name: 'Sword' },
  { icon: Book, name: 'Book' },
  { icon: Compass, name: 'Compass' },
  { icon: Map, name: 'Map' },
  { icon: Mountain, name: 'Mountain' },
  { icon: Sun, name: 'Sun' },
  { icon: Moon, name: 'Moon' },
  { icon: Lightbulb, name: 'Lightbulb' },
  { icon: Flag, name: 'Flag' },
  { icon: Crosshair, name: 'Crosshair' },
  { icon: Eye, name: 'Eye' },
  { icon: Gift, name: 'Gift' }
];

const IconSelector = ({ onSelect, selectedIcon } : { onSelect: (iconName: string) => void, selectedIcon: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cerrar al hacer clic fuera del modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('icon-modal');
      if (modal && !modal.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredIcons = icons.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (iconName: string) => {
    onSelect(iconName);
    setIsOpen(false);
  };

  const IconComponent = icons.find(i => i.name === selectedIcon)?.icon || Trophy;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#353535] text-white p-3 rounded-xl flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
      >
        <div className="flex items-center">
          <IconComponent className="w-6 h-6 mr-2 text-gray-400" />
          <span>{selectedIcon || 'Seleccionar ícono'}</span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            id="icon-modal"
            className="bg-[#353535] rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Seleccionar Ícono</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#454545] rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar ícono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#242424] text-white p-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-lg"
              />
            </div>
            
            {/* Icons Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 overflow-y-auto p-2">
              {filteredIcons.map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center hover:bg-[#454545] transition-colors ${
                    selectedIcon === name ? 'bg-pink-600' : 'bg-[#242424]'
                  }`}
                >
                  <Icon className="w-8 h-8 mb-2 text-gray-300" />
                  <span className="text-xs text-gray-300 truncate w-full text-center">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSelector;