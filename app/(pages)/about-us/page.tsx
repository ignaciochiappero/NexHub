"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Star, Users, Shield, Code } from "lucide-react";
import Link from "next/link";

export default function SobreNosotros() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const fadeInUp = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const features = [
    {
      title: "Unidos por una Visión",
      description: "Forma parte de una comunidad donde cada logro colectivo nos acerca al éxito.",
      icon: Users,
    },
    {
      title: "Confianza y Seguridad",
      description: "Tu información y la de tu equipo están protegidas con tecnología de última generación.",
      icon: Shield,
    },
    {
      title: "Herramientas Innovadoras",
      description: "Avanza con las mejores prácticas y tecnologías modernas para alcanzar tus metas.",
      icon: Code,
    }
  ];

  return (
    <div className="font-[family-name:var(--blender-medium)] min-h-screen bg-[#1a1a1a] text-white overflow-hidden px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h1 
            className="text-6xl font-blender-mayus bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ¡Bienvenido a Nuestra Plataforma!
          </motion.h1>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-20"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="initial"
          animate="animate"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="relative p-8 rounded-2xl bg-[#242424] hover:bg-[#2a2a2a] transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-20"
                  animate={{
                    scale: hoveredCard === index ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 1, repeat: hoveredCard === index ? Infinity : 0 }}
                />
                <Icon className="w-12 h-12 mb-4 text-pink-500" />
                <h3 className="text-xl font-blender-medium mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="relative rounded-2xl bg-[#242424] p-12 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between gap-8"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
              initial="initial"
              animate="animate"
              transition={{ delay: 1 }}
            >
              <div className="flex-1">
                <h2 className="text-4xl font-blender-mayus mb-4">¿Listo para Empezar?</h2>
                <p className="text-gray-400 mb-6">Únete a nuestra comunidad y empieza a construir logros compartidos.</p>

                <Link href={"/auth/login"}>
                  <motion.button
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 rounded-xl font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ¡Comienza Ahora! <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                
              </div>
              
              <motion.div
                className="flex-1 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-32 h-32 text-pink-500/20 absolute" />
                <Star className="w-32 h-32 text-purple-500/20 absolute transform rotate-45" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
