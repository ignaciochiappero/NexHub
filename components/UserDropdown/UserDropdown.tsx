"use client"; 
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User2, LogOut, MessageCircle, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { User } from '@prisma/client';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginButton, setShowLoginButton] = useState(false); // Estado para controlar el retraso en mostrar el botón de login

  const fetchUser = async (userId: number) => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    // Retrasamos la visualización del botón de login después de un segundo
    setTimeout(() => {
      setShowLoginButton(true);
    }, 1000); // Retraso de 1 segundo

    if (session?.user?.id) {
      fetchUser(Number(session.user.id));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      const position = window.scrollY;
      setIsAtTop(position < 10);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    handleScroll(); // Llamada inicial para establecer el estado correcto

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [session]);

  const menuItems = [
    {
      label: 'Perfil',
      icon: User2,
      href: '/dashboard/profile',
    },
    {
      label: 'Mensajes',
      icon: MessageCircle,
      href: '/dashboard/messages',
    },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: () => signOut({ 
        callbackUrl: '/' // Esto redireccionará al usuario al home después del logout
      }),
    },
  ];

  if (!session && showLoginButton) { // Condición para mostrar el botón de login después de un segundo
    return (
      <div className="absolute top-6 right-6 opacity-100 pointer-events-auto">
        <Link href="/auth/login" className="font-[family-name:var(--blender-bold)] bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg hover:shadow-pink-500/25 transition-all rounded-xl px-4 py-2 duration-300 flex items-center gap-2 transform hover:scale-105">
          <User2 className="w-4 h-4" />
          <span>Login</span>
        </Link>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`absolute top-6 right-6 font-[family-name:var(--blender-bold)] transition-opacity duration-300 ${isAtTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#353535] text-white transform transition-all duration-300 hover:bg-[#454545] ${isOpen ? 'ring-2 ring-rose-500' : ''}`}>
        {loading ? (
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
        ) : (
          <Image 
            height={30} 
            width={30} 
            src={user?.image || "/user.png"} 
            alt="profile"
            className='rounded-full'
          />
        )}
        <span className={`text-sm ${loading ? 'bg-gray-300 w-20 h-4 rounded animate-pulse' : ''}`}>
          {loading ? '' : session?.user?.name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg transform transition-all duration-300 origin-top-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
        <div className="py-2">
          {menuItems.map((item, index) => {
            const ItemIcon = item.icon;
            if (item.href) {
              return (
                <Link key={index} href={item.href} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 text-sm hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsOpen(false)}>
                  <ItemIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            }
            return (
              <button key={index} onClick={() => { setIsOpen(false); item.onClick?.(); }} className="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200">
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
