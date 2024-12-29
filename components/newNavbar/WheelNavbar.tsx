
//components\newNavbar\WheelNavbar.tsx
"use client";

import React, { useState } from 'react';
import { Home, Shield, Settings, Users, Trophy } from 'lucide-react';
import HamburgerIcon from './hambIcon/HamburguerIcon';
import Link from 'next/link';

const RadialNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, icon: Home, angle: 0, label: 'Inicio', site: '/' },
    { id: 2, icon: Users, angle: 22.5, label: 'Blog', site: '/dashboard/blog' },
    { id: 3, icon: Shield, angle: 45, label: 'Administración', site: '/admin' },
    { id: 4, icon: Trophy, angle: 67.5, label: 'Logros', site: '/logros' },
    { id: 5, icon: Settings, angle: 90, label: 'Configuración', site: '/dashboard/profile' },
  ];

  const radius = 210;

  const handleLinkClick = () => {
    setIsOpen(false); // Cierra el menú y restablece el ícono al estado inicial
  };

  const getTooltipPosition = (angle: number) => {
    if (angle === 0) {
      return 'top-full mt-2 left-1/2 -translate-x-1/2 -translate-y-3 group-hover:translate-y-0';
    }
    return 'left-full ml-2 top-1/2 -translate-y-1/2 -translate-x-3 group-hover:translate-x-0';
  };

  return (
    <nav className="fixed top-0 left-0 z-50 font-[family-name:var(--blender-medium)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 group bg-[#353535] rounded-full hover:bg-[#454545] transition-colors duration-300 m-6"
      >
        <div className="flex items-center justify-center rounded-full w-12 h-12 group">
          <HamburgerIcon isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </button>

      <div
        className={`absolute top-0 left-0 w-80 h-80 
        bg-[#353535]/20 backdrop-blur-md
        transition-all duration-500 origin-top-left
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          borderBottomRightRadius: '100%',
        }}
      />

      <div className="absolute top-0 left-0">
        {menuItems.map(({ id, icon: Icon, angle, label, site }, index) => {
          const delay = index * 100;
          const angleInRadians = (90 - angle) * (Math.PI / 180);
          const x = radius * Math.cos(angleInRadians);
          const y = radius * Math.sin(angleInRadians);

          return (
            <div key={id} className="group">
              <Link
                href={site || '/'}
                onClick={handleLinkClick} // Cierra el menú al hacer clic en un enlace
                className={`absolute p-3 bg-white rounded-full 
              hover:bg-gray-100 hover:scale-110 transition-all duration-500 
              transform group shadow-lg
              ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                style={{
                  transform: `translate(${isOpen ? x : 0}px, ${isOpen ? y : 0}px) scale(${isOpen ? 1 : 0})`,
                  transitionDelay: `${isOpen ? delay : 0}ms`,
                  left: '24px',
                  top: '24px',
                }}
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-gray-800 group-hover:scale-125  transition-all duration-500" />
                <div
                  className={`absolute whitespace-nowrap px-2 py-1 text-base
                bg-white text-gray-900 rounded-md opacity-0
                transition-all duration-300 ease-in-out pointer-events-none
                group-hover:opacity-100 ${getTooltipPosition(angle)}`}
                >
                  {label}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default RadialNavbar;
