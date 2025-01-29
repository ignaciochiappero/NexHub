import React from 'react';

const TechPlayIcon = ({ className = "" }: { className?: string }) => (
  <div className={`group ${className}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="w-full h-full transition-all duration-500 ease-out group-hover:scale-105"
    >

      {/* Fragmentos irregulares superiores dispersos */}
      <path 
        d="M15 10L24 16L14 18Z" 
        className="fill-stone-100/70 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-2"
      />
      <path 
        d="M24 16L32 20L22 23Z" 
        className="fill-stone-200/80 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1"
      />
      
      {/* Fragmentos irregulares inferiores dispersos */}
      <path 
        d="M16 38L25 32L14 30Z" 
        className="fill-stone-100/70 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
      />
      <path 
        d="M25 32L34 27L23 25Z" 
        className="fill-stone-200/80 transition-all duration-500 ease-out group-hover:translate-x-0.1 group-hover:-translate-y-1"
      />
      
      {/* Fragmentos decorativos muy dispersos */}
      <path 
        d="M12 19L15 23L11 25Z" 
        className="fill-stone-50/50 transition-all duration-500 ease-out group-hover:translate-x-3"
      />
      <path 
        d="M12 29L15 25L11 23Z" 
        className="fill-stone-50/50 transition-all duration-500 ease-out group-hover:translate-x-3"
      />
      <path 
        d="M33 23L37 26L33 29Z" 
        className="fill-stone-100/60 transition-all duration-500 ease-out group-hover:-translate-x-2"
      />
      
      {/* Fragmentos pequeños adicionales muy separados */}
      <path 
        d="M10 21L13 24L10 27Z" 
        className="fill-stone-50/40 transition-all duration-500 ease-out group-hover:translate-x-4"
      />
      <path 
        d="M35 20L38 24L35 28Z" 
        className="fill-stone-50/40 transition-all duration-500 ease-out group-hover:-translate-x-2"
      />
      
      {/* Fragmentos extra asimétricos */}
      <path 
        d="M28 15L31 18L26 19Z" 
        className="fill-stone-100/30 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1.5"
      />
      <path 
        d="M28 33L32 30L26 29Z" 
        className="fill-stone-100/30 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1.5"
      />

      {/* Fragmento central - Triángulo con puntas redondeadas */}
      <path 
        d="M19 15.8
           Q19 15 19.8 15.2
           C26 19.5 30 22.5 32.2 23.7
           Q33.2 24 32.2 24.3
           C30 25.5 26 28.5 19.8 32.8
           Q19 33 19 32.2
           Z" 
        className="fill-stone-50/90 
                   transition-all 
                   duration-500 
                   ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                   origin-center
                   transform-gpu
                   group-hover:translate-x-0.5 
                   group-hover:scale-125
                   group-hover:fill-stone-100
                   active:scale-95
                   active:fill-stone-200"
      />
      
    </svg>
  </div>
);

export default TechPlayIcon;