"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ParticleProps {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const ParticleBackground = ({ color = "#d946ef" }: { color?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Aumentado el número de partículas y su opacidad
    const particles: ParticleProps[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1.5, // Velocidad aumentada
      speedY: (Math.random() - 0.5) * 1.5, // Velocidad aumentada
      opacity: Math.random() * 0.7 + 0.3, // Opacidad base más alta
    }));

    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseMoving = true;
      setTimeout(() => (isMouseMoving = false), 100);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
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

        particle.x = (particle.x + canvas.width) % canvas.width;
        particle.y = (particle.y + canvas.height) % canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();

        particles.forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            // Aumentado el rango de conexión
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `${color}${Math.floor((1 - distance / 120) * 50)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.stroke();
          }
        });
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity: 0.5 }} // Aumentada la opacidad base
    />
  );
};

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      router.push("/about-us");
    }, 800);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#1a1a1a] text-white">
      {/* Overlay para la transición de página */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-opacity duration-700 ease-in-out ${
          isClicked ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Partículas de fondo */}
      <ParticleBackground />

      <main className="flex flex-col gap-8 row-start-2 items-center justify-center mt-20 relative z-10">
        <div
          className="group animate-float cursor-pointer relative"
          onClick={handleClick}
        >
          {/* Efecto de brillo mejorado */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-300"
            style={{
              background:
                "radial-gradient(circle at center, rgba(217, 70, 239, 0.2), transparent 70%)",
              opacity: 0.6,
              filter: "blur(20px)",
              transform: "scale(1.2)",
            }}
          />

          {/* Brillo adicional en hover */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              background:
                "radial-gradient(circle at center, rgba(217, 70, 239, 0.3), transparent 70%)",
              filter: "blur(25px)",
              transform: "scale(1.3)",
            }}
          />

          {/* Contenedor de la imagen con efecto de reducción en hover */}
          <div className="relative transform transition-all duration-700 ease-in-out group-hover:scale-95">
            <Image
              className={`animate-neon-pulse relative z-10 transition-transform duration-500
          ${isClicked ? "scale-150" : ""}`}
              src="/logo 5.png"
              alt="Nex-hub-logo"
              width={200}
              height={200}
              priority
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <span className="text-3xl font-[family-name:var(--blender-medium)]">
            Bienvenidos a Nex Hub!
          </span>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-20 text-white/70 relative z-10">
        By NachoDev - 2025
      </footer>
    </div>
  );
}
