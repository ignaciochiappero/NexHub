"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      router.push('/about-us');
    }, 800); // Reducido a 800ms para una transición más rápida
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Overlay para la transición de página */}
      <div className={`fixed inset-0 bg-white z-50 transition-opacity duration-700 ease-in-out ${isClicked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center mt-20">
        <div 
          className={`group animate-float cursor-pointer relative`}
          onClick={handleClick}
        >
          {/* Efecto hover sutil */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <div className="absolute inset-0 blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
          </div>

          {/* Contenedor de la imagen */}
          <div className="relative transform transition-all duration-700 ease-in-out
            group-hover:scale-105">
            <Image
              className={`animate-neon-pulse relative z-10 transition-transform duration-500
                ${isClicked ? 'scale-150' : ''}`}
              src="/logo 5.png"
              alt="Nex-hub-logo"
              width={200}
              height={200}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <span className="text-3xl font-[family-name:var(--blender-medium)]">
            Bienvenidos a Nex Hub!
          </span>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-20">
        By NachoDev - 2024
      </footer>


    </div>
  );
}