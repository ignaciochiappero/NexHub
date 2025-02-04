
"use client";

import Link from 'next/link';
import { Users, Trophy, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';


interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const ParticleBackground = ({ color }: { color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5
      });
    }

    function animate() {
      if(ctx  && canvas){

        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        particles.forEach(particle => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.opacity += (Math.random() - 0.5) * 0.01;
    
          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
          if (particle.opacity < 0) particle.opacity = 0;
          if (particle.opacity > 1) particle.opacity = 1;
    
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
          
        });
  
        requestAnimationFrame(animate);
        
      }

    }

    animate();
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.3 }}
    />
  );
};

const AdminPanel = () => {
  const menuItems = [
    {
      title: "Gestión de Usuarios",
      icon: Users,
      href: "/admin/users",
      color: "#ec4899",
      particleColor: "#ec4899",
      gradient: "from-pink-600/20 to-transparent",
      borderColor: "pink-500",
      shadowColor: "rgba(236,72,153,0.3)"
    },
    {
      title: "Gestión de Logros y Premios",
      icon: Trophy,
      href: "/admin/logros",
      color: "#8b5cf6",
      particleColor: "#8b5cf6",
      gradient: "from-violet-600/20 to-transparent",
      borderColor: "violet-500",
      shadowColor: "rgba(139,92,246,0.3)"
    },
    {
      title: "Solicitudes de Logros",
      icon: CheckSquare,
      href: "/admin/requests",
      color: "#06b6d4",
      particleColor: "#06b6d4",
      gradient: "from-cyan-600/20 to-transparent",
      borderColor: "cyan-500",
      shadowColor: "rgba(6,182,212,0.3)"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };


 const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.7
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] p-6 pt-20">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="md:text-6xl max-sm:text-4xl  text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-16 text-center font-[family-name:var(--blender-bold)] tracking-wider"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Panel de Administración
        </motion.h1>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-8 px-4">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
              >
                <Link href={item.href} className="block">
                  <motion.div 
                    className={`
                      group relative h-[500px] bg-[#353535] rounded-2xl overflow-hidden 
                      transition-all duration-700 ease-out 
                      hover:bg-[#454545] hover:scale-105 hover:rotate-1 
                      active:scale-95 active:rotate-0
                    `}
                    style={{
                      boxShadow: `0 0 40px ${item.shadowColor}`
                    }}
                  >
                    
                    <ParticleBackground color={item.particleColor} />

                    <div className={`
                      absolute inset-0 bg-gradient-to-br ${item.gradient}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700
                    `}/>
                    
                    <div className={`
                      absolute inset-0 border-2 border-transparent 
                      group-hover:border-${item.borderColor}/50 rounded-2xl 
                      transition-all duration-700 
                      group-hover:scale-105 group-hover:rotate-2
                    `}/>
                    
                    <div className="relative h-full flex flex-col items-center justify-center gap-8 p-8">
                    
                      <motion.div
                        className="relative p-6 rounded-full bg-black/30"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 360,
                        }}
                        transition={{ duration: 0.5 }}
                        style={{
                          boxShadow: `0 0 30px ${item.color}40`
                        }}
                      >
                        <IconComponent 
                          size={40} 
                          className="text-white transition-all duration-300"
                          style={{ filter: `drop-shadow(0 0 10px ${item.color})` }}
                        />
                      </motion.div>
                      
                      <motion.span 
                        className="text-3xl text-white font-[family-name:var(--blender-medium)] tracking-wider text-center
                        group-hover:scale-110 transition-transform duration-500"
                      >
                        {item.title}
                      </motion.span>
                      
                      <div className={`
                        w-16 h-1 
                        transform group-hover:scale-x-150 transition-transform duration-500
                      `}
                      style={{ background: item.color }}
                      />

                      <div className={`
                        absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-xl
                        group-hover:scale-150 transition-transform duration-700
                      `}
                      style={{ background: `${item.color}20` }}
                      />
                      <div className={`
                        absolute -top-20 -left-20 w-40 h-40 rounded-full blur-xl
                        group-hover:scale-150 transition-transform duration-700
                      `}
                      style={{ background: `${item.color}10` }}
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;