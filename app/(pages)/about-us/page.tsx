"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Trophy, 
  Heart, 
  Zap,
  Rocket,
  Globe,
  TrendingUp,
  Play,
  Pause,
  Minimize2,
  Maximize2,
  Volume2,
  Volume1,
  VolumeX,
  RotateCcw
} from 'lucide-react';

// Tipos
interface ParticleProps {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface FeatureProps {
  frontIcon: React.ElementType;
  frontTitle: string;
  backTitle: string;
  backDescription: string;
  color: string;
}

interface InsightProps {
  icon: React.ElementType;
  title: string;
  description: string;
  stats: string;
  color: string;
  backgroundColor: string;
}
const VideoPresentation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Maneja el mouse move y el timeout para ocultar controles
  const handleMouseMove = () => {
    setShowControls(true);
    
    // Limpia el timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Establece un nuevo timeout incluso si está en hover
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  // Manejador para cuando el video termina
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  // Limpia el timeout cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowControls(false);
      }}
    >
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
      
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full rounded-2xl"
        poster="/video-thumbnail.jpg"
        onClick={toggleVideo}
        onEnded={handleVideoEnd}
      >
        <source src="/NexHub-Presentation.mp4" type="video/mp4" />
      </video>

      {/* Controles */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 p-4 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Contenedor izquierdo: Play/Pause y Reiniciar */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleVideo}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg
                       flex items-center justify-center
                       border-2 border-white/30 hover:border-white/50
                       transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </motion.button>

          <motion.button
            onClick={restartVideo}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg
                       flex items-center justify-center
                       border-2 border-white/30 hover:border-white/50
                       transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Contenedor derecho: Volumen y Pantalla Completa */}
        <div className="flex items-center gap-4">
          {/* Control de volumen con botón de mute */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
            <button onClick={toggleMute}>
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 appearance-none bg-white/30 rounded-full outline-none
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-3
                       [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-white
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-3
                       [&::-moz-range-thumb]:h-3
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-white
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Botón de pantalla completa */}
          <motion.button
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg
                       flex items-center justify-center
                       border-2 border-white/30 hover:border-white/50
                       transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFullscreen ? (
              <Minimize2 className="w-6 h-6 text-white" />
            ) : (
              <Maximize2 className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Botón central de Play (solo visible al inicio o cuando está pausado) */}
      {!isPlaying && showControls && (
        <motion.button
          onClick={toggleVideo}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20
                     w-20 h-20 rounded-full bg-white/10 backdrop-blur-lg
                     flex items-center justify-center
                     border-2 border-white/30 hover:border-white/50
                     transition-all duration-300"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-8 h-8 text-white ml-1" />
        </motion.button>
      )}
    </motion.div>
  );
};

// Componente de Partículas Mejorado
const ParticleBackground = ({ color, density = 50 }: { color: string; density?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const particles: ParticleProps[] = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5
    }));

    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseMoving = true;
      setTimeout(() => isMouseMoving = false, 100);
    });

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        if (isMouseMoving) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            particle.x -= Math.cos(angle) * 2;
            particle.y -= Math.sin(angle) * 2;
          }
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.opacity += (Math.random() - 0.5) * 0.01;

        particle.x = particle.x < 0 ? canvas.width : particle.x > canvas.width ? 0 : particle.x;
        particle.y = particle.y < 0 ? canvas.height : particle.y > canvas.height ? 0 : particle.y;
        particle.opacity = Math.max(0, Math.min(1, particle.opacity));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${color}${Math.floor((1 - distance / 100) * 50).toString(16).padStart(2, '0')}`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.3 }}
    />
  );
};

// Componente IconPulse mejorado
const IconPulse = ({ Icon, color }: { Icon: React.ElementType; color: string }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative"
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      >
        <Icon 
          className="w-16 h-16" 
          style={{ 
            color,
            filter: `blur(8px) brightness(1.5)`
          }} 
        />
      </motion.div>
      <Icon 
        className="w-16 h-16 relative z-10" 
        style={{ 
          color,
          filter: `drop-shadow(0 0 20px ${color})`
        }} 
      />
    </motion.div>
  );
};

const FlipCard = ({ frontIcon: Icon, frontTitle, backTitle, backDescription, color }: FeatureProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      className="relative w-full h-[400px] cursor-pointer rounded-2xl"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-all duration-300 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Frente de la tarjeta */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden">
          <div 
            className="w-full h-full p-8 flex flex-col items-center justify-center gap-8
                       bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm
                       rounded-2xl"
            style={{ 
              boxShadow: `0 0 30px ${color}30`,
              border: `2px solid ${color}30`
            }}
          >
            <IconPulse Icon={Icon} color={color} />
            <h3 className="text-2xl font-[family-name:var(--blender-bold)] text-center text-white"
                style={{ textShadow: `0 0 10px ${color}` }}>
              {frontTitle}
            </h3>
          </div>
        </div>

        {/* Dorso de la tarjeta */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
          <div 
            className="w-full h-full p-8 flex flex-col items-center justify-center gap-6
                       bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm
                       rounded-2xl"
            style={{ 
              boxShadow: `0 0 30px ${color}30`,
              border: `2px solid ${color}30`
            }}
          >
            <h3 className="text-xl font-[family-name:var(--blender-bold)] text-white mb-4 text-center"
                style={{ textShadow: `0 0 10px ${color}` }}>
              {backTitle}
            </h3>
            <p className="text-gray-200 text-center font-[family-name:var(--blender-medium)] leading-relaxed">
              {backDescription}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de Slider para Insights
const InsightSlider = ({ insights }: { insights: InsightProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [insights.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <InsightCard {...insights[currentIndex]} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {insights.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Componente InsightCard mejorado
const InsightCard = ({ icon: Icon, title, description, stats, color, backgroundColor }: InsightProps) => {
  return (
    <motion.div
      className="p-8 rounded-2xl overflow-hidden relative"
      whileHover={{ 
        scale: 1.02,
      }}
      style={{ 
        background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd)`,
      }}
    >
      {/* Fondo con efecto de luz */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`
        }}
      />
      
      {/* Partículas de fondo */}
      <ParticleBackground color={color} density={30} />

      <div className="relative z-10 flex items-start gap-6">
        <div className="flex-shrink-0">
          <IconPulse Icon={Icon} color={color} />
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-3xl font-[family-name:var(--blender-bold)] text-white mb-4"
                style={{ textShadow: `0 0 20px ${color}50` }}>
              {title}
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              {description}
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="px-6 py-3 rounded-xl glass-effect"
                 style={{ 
                   boxShadow: `0 0 30px ${color}30`,
                   border: `2px solid ${color}30`
                 }}>
              <span className="text-2xl font-[family-name:var(--blender-bold)] text-white"
                    style={{ textShadow: `0 0 10px ${color}` }}>
                {stats}
              </span>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 opacity-20"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{background: `conic-gradient(from 0deg at 50% 50%, ${color}, transparent)`,
            filter: 'blur(40px)',
          }}
        />
      </div>
    </div>
  </motion.div>
);
};

// Componente Badge Animado
const AnimatedBadge = ({ text, color }: { text: string; color: string }) => {
return (
  <motion.div
    className="px-6 py-3 rounded-full backdrop-blur-lg relative overflow-hidden"
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    style={{
      background: `linear-gradient(135deg, ${color}20, ${color}40)`,
      border: `2px solid ${color}30`,
      boxShadow: `0 0 20px ${color}30`
    }}
  >
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          `linear-gradient(0deg, ${color}00, ${color}20)`,
          `linear-gradient(180deg, ${color}00, ${color}20)`,
          `linear-gradient(360deg, ${color}00, ${color}20)`,
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <span className="relative z-10 text-white font-[family-name:var(--blender-medium)]">
      {text}
    </span>
  </motion.div>
);
};

// Componente principal AboutUs
export default function AboutUs() {
const features = [
  {
    frontIcon: Users,
    frontTitle: "Conexión Social",
    backTitle: "Comunidad Empresarial",
    backDescription: "Potencia las conexiones internas con una red social empresarial que aumenta la productividad en un 25% y mejora la retención de talentos.",
    color: "#ff00ff"
  },
  {
    frontIcon: MessageCircle,
    frontTitle: "Comunicación Efectiva",
    backTitle: "Mensajería Inteligente",
    backDescription: "Optimiza la comunicación interna con herramientas de última generación que reducen los malentendidos en un 80%.",
    color: "#d946ef"
  },
  {
    frontIcon: Trophy,
    frontTitle: "Sistema de Logros",
    backTitle: "Gamificación Empresarial",
    backDescription: "Implementa estrategias de gamificación que aumentan el compromiso en un 60% y transforman el ambiente laboral.",
    color: "#8b5cf6"
  },
  {
    frontIcon: Zap,
    frontTitle: "Innovación Continua",
    backTitle: "Plataforma Evolutiva",
    backDescription: "Impulsa la innovación con una plataforma que facilita la implementación de nuevas ideas, aumentando la eficiencia en un 84%.",
    color: "#06b6d4"
  }
];

const culturalInsights = [
  {
    icon: Heart,
    title: "Compromiso y Pertenencia",
    description: "Construye una cultura corporativa única que inspire y conecte a tu equipo, impulsando el compromiso y la satisfacción laboral.",
    stats: "140% más de compromiso",
    color: "#ff00ff",
    backgroundColor: "#ffffff10"
  },
  {
    icon: Globe,
    title: "Alcance Global",
    description: "Conecta equipos distribuidos globalmente con herramientas que eliminan barreras y fomentan la colaboración efectiva.",
    stats: "24/7 Conectividad",
    color: "#d946ef",
    backgroundColor: "#ffffff15"
  },
  {
    icon: TrendingUp,
    title: "Crecimiento Sostenible",
    description: "Implementa estrategias que impulsan el crecimiento continuo y el desarrollo profesional de tu equipo.",
    stats: "85% Tasa de Retención",
    color: "#8b5cf6",
    backgroundColor: "#ffffff10"
  }
];

return (
  <div className="min-h-screen font-[family-name:var(--blender-medium)] bg-[#1a1a1a]">
    {/* Hero Section */}
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground color="#d946ef" density={70} />
      
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 blur-3xl opacity-40"
               style={{ background: 'radial-gradient(circle at center, #ff00ff, transparent 70%)' }} />
          <Image
            src="/logo 5.png"
            alt="NexHub Logo"
            width={200}
            height={200}
            className="relative z-10 animate-float"
          />
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-[family-name:var(--blender-bold)] mb-6
                     bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textShadow: "0 0 40px rgba(217, 70, 239, 0.6)" }}
        >
          Bienvenido a NexHub
        </motion.h1>
        
        <motion.p 
          className="text-2xl md:text-3xl text-gray-200 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Transformando la cultura empresarial a través de la innovación social
        </motion.p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/auth/login">
            <button className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-600
                             rounded-xl text-xl text-white font-[family-name:var(--blender-medium)]
                             hover:from-fuchsia-700 hover:to-cyan-700 transition-all duration-300
                             relative overflow-hidden group">
              <span className="relative z-10">Descubre el Futuro</span>
              <motion.div
                className="absolute inset-0 opacity-50"
                animate={{
                  background: [
                    "linear-gradient(0deg, transparent, rgba(255,255,255,0.2))",
                    "linear-gradient(180deg, transparent, rgba(255,255,255,0.2))",
                    "linear-gradient(360deg, transparent, rgba(255,255,255,0.2))"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Rocket className="inline-block ml-2 group-hover:rotate-12 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Video Section */}
    <section className="py-20 px-6 bg-gradient-to-br from-black via-purple-900/20 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <ParticleBackground color="#d946ef" density={30} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--blender-bold)] mb-6
                       bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Descubre NexHub en Acción
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Mira cómo NexHub está transformando la cultura empresarial y potenciando equipos en todo el mundo
          </p>
        </motion.div>

        <VideoPresentation />
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 px-6 bg-gradient-to-br from-black/40 to-purple-900/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      
      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <FlipCard key={index} {...feature} />
        ))}
      </motion.div>
    </section>

    {/* Insights Section */}
    <section className="py-20 px-6 bg-gradient-to-br from-white/5 via-purple-900/20 to-cyan-900/20 relative">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <InsightSlider insights={culturalInsights} />
      </motion.div>
    </section>

    {/* CTA Section */}
    <section className="py-20 px-6 bg-gradient-to-br from-fuchsia-900/20 via-purple-900/20 to-cyan-900/20 relative">
      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-6xl font-[family-name:var(--blender-bold)] mb-8
                     bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ textShadow: "0 0 30px rgba(217, 70, 239, 0.5)" }}>
          ¿Listo para Revolucionar tu Empresa?
        </h2>
        <p className="text-2xl text-gray-200 mb-12 leading-relaxed">
          Únete a las empresas que están redefiniendo el futuro del trabajo
          <br />y construyendo culturas extraordinarias
        </p>
        
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {[
            { text: "Innovación Continua", color: "#ff00ff" },
            { text: "Cultura Digital", color: "#d946ef" },
            { text: "Conexión Social", color: "#8b5cf6" },
            { text: "Gamificación", color: "#06b6d4" }
          ].map((badge, index) => (
            <AnimatedBadge key={index} {...badge} />
          ))}
        </div>
      </motion.div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-6 bg-black/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-30"
                 style={{ background: 'radial-gradient(circle at center, #ff00ff, transparent 70%)' }} />
            <Image
              src="/logo 5.png"
              alt="NexHub Logo"
              width={100}
              height={100}
              className="relative z-10"
            />
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Transformando la cultura empresarial, un equipo a la vez.
          </p>
          <motion.div
            className="w-32 h-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
            animate={{
              width: ["8rem", "12rem", "8rem"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>
    </footer>
  </div>
);
}