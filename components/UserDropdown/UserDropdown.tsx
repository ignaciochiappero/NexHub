"use client";

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: { target: Node | null; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      const position = window.scrollY;
      setIsAtTop(position < 10); // Consideramos "top" cuando estamos a menos de 10px del inicio
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    // Llamada inicial para establecer el estado correcto
    handleScroll();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    {
      label: 'Perfil',
      icon: User,
      href: '/dashboard/profile',
    },
    // {
    //   label: 'Settings',
    //   icon: Settings,
    //   href: '/dashboard/settings',
    // },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: () => signOut(),
    },
  ];

  if (!session) {
    return (
      <div className={`
        absolute top-6 right-6
        transition-opacity duration-300
        ${isAtTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <Link
          href="/auth/login"
          className="bg-yellow-400 hover:bg-yellow-500 rounded-xl px-4 py-2 transition-all duration-300 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span>Login</span>
        </Link>
      </div>
    );
  }

  return (
    <div 
      className={`
        absolute top-6 right-6 
        font-[family-name:var(--blender-bold)]
        transition-opacity duration-300
        ${isAtTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} 
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-xl
          bg-[#353535] text-white
          transform transition-all duration-300
          hover:bg-[#454545]
          ${isOpen ? 'ring-2 ring-yellow-400' : ''}
        `}
      >
        {/* Comment this when implementing profile picture */}
        <span className="text-sm">{session?.user?.name}</span>
        {/* Uncomment and modify this for profile picture
        <img
          src={session?.user?.image}
          alt={session?.user?.name}
          className="w-8 h-8 rounded-full"
        />
        */}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`
          absolute right-0 mt-2 w-48
          bg-white rounded-xl shadow-lg
          transform transition-all duration-300 origin-top-right
          ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <div className="py-2">
          {menuItems.map((item, index) => {
            const ItemIcon = item.icon;
            
            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="
                    flex items-center gap-2 px-4 py-2
                    text-gray-700 hover:text-gray-900 text-sm
                    hover:bg-gray-100 transition-colors duration-200
                  "
                  onClick={() => setIsOpen(false)}
                >
                  <ItemIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className="
                  flex items-center gap-2 px-4 py-2 w-full text-sm
                  text-red-600 hover:text-red-700
                  hover:bg-red-50 transition-colors duration-200
                "
              >
                <ItemIcon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;