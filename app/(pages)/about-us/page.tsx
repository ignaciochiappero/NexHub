"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, MessageCircle, Trophy, Heart, Zap, Rocket, Globe, TrendingUp } from "lucide-react"
import { VideoPresentation } from "@/components/aboutUsPage/video-presentation"
import { ParticleBackground } from "@/components/aboutUsPage/particle-background"

import { FlipCard } from "@/components/aboutUsPage/flip-card"
import { InsightSlider } from "@/components/aboutUsPage/insight-slider"
import { AnimatedBadge } from "@/components/aboutUsPage/animated-badge"

export default function AboutUs() {
  const features = [
    {
      frontIcon: Users,
      frontTitle: "Conexión Social",
      backTitle: "Comunidad Empresarial",
      backDescription:
        "Potencia las conexiones internas con una red social empresarial que aumenta la productividad en un 25% y mejora la retención de talentos.",
      color: "#ff00ff",
    },
    {
      frontIcon: MessageCircle,
      frontTitle: "Comunicación Efectiva",
      backTitle: "Mensajería Inteligente",
      backDescription:
        "Optimiza la comunicación interna con herramientas de última generación que reducen los malentendidos en un 80%.",
      color: "#d946ef",
    },
    {
      frontIcon: Trophy,
      frontTitle: "Sistema de Logros",
      backTitle: "Gamificación Empresarial",
      backDescription:
        "Implementa estrategias de gamificación que aumentan el compromiso en un 60% y transforman el ambiente laboral.",
      color: "#8b5cf6",
    },
    {
      frontIcon: Zap,
      frontTitle: "Innovación Continua",
      backTitle: "Plataforma Evolutiva",
      backDescription:
        "Impulsa la innovación con una plataforma que facilita la implementación de nuevas ideas, aumentando la eficiencia en un 84%.",
      color: "#06b6d4",
    },
  ]

  const culturalInsights = [
    {
      icon: Heart,
      title: "Compromiso y Pertenencia",
      description:
        "Construye una cultura corporativa única que inspire y conecte a tu equipo, impulsando el compromiso y la satisfacción laboral.",
      stats: "140% más de compromiso",
      color: "#ff00ff",
      backgroundColor: "#ffffff10",
    },
    {
      icon: Globe,
      title: "Alcance Global",
      description:
        "Conecta equipos distribuidos globalmente con herramientas que eliminan barreras y fomentan la colaboración efectiva.",
      stats: "24/7 Conectividad",
      color: "#d946ef",
      backgroundColor: "#ffffff15",
    },
    {
      icon: TrendingUp,
      title: "Crecimiento Sostenible",
      description:
        "Implementa estrategias que impulsan el crecimiento continuo y el desarrollo profesional de tu equipo.",
      stats: "85% Tasa de Retención",
      color: "#8b5cf6",
      backgroundColor: "#ffffff10",
    },
  ]

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
            <div
              className="absolute inset-0 blur-3xl opacity-40"
              style={{ background: "radial-gradient(circle at center, #ff00ff, transparent 70%)" }}
            />
            <Image
              src="/logo 5.png"
              alt="NexHub Logo"
              width={200}
              height={200}
              className="relative z-10 animate-float"
            />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-[family-name:var(--blender-bold)] mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
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
              <button className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl text-xl text-white font-[family-name:var(--blender-medium)] hover:from-fuchsia-700 hover:to-cyan-700 transition-all duration-300 relative overflow-hidden group">
                <span className="relative z-10">Descubre el Futuro</span>
                <motion.div
                  className="absolute inset-0 opacity-50"
                  animate={{
                    background: [
                      "linear-gradient(0deg, transparent, rgba(255,255,255,0.2))",
                      "linear-gradient(180deg, transparent, rgba(255,255,255,0.2))",
                      "linear-gradient(360deg, transparent, rgba(255,255,255,0.2))",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
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
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--blender-bold)] mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
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
          <h2
            className="text-5xl md:text-6xl font-[family-name:var(--blender-bold)] mb-8 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ textShadow: "0 0 30px rgba(217, 70, 239, 0.5)" }}
          >
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
              { text: "Gamificación", color: "#06b6d4" },
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
              <div
                className="absolute inset-0 blur-3xl opacity-30"
                style={{ background: "radial-gradient(circle at center, #ff00ff, transparent 70%)" }}
              />
              <Image src="/logo 5.png" alt="NexHub Logo" width={100} height={100} className="relative z-10" />
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
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

