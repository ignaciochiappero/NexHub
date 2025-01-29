"use client"

import { motion } from "framer-motion"
import { IconPulse } from "./icon-pulse"
import { ParticleBackground } from "./particle-background"
import type React from "react" // Import React

export interface InsightProps {
  icon: React.ElementType
  title: string
  description: string
  stats: string
  color: string
  backgroundColor: string
}

export const InsightCard = ({ icon: Icon, title, description, stats, color, backgroundColor }: InsightProps) => {
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
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
        }}
      />

      <ParticleBackground color={color} density={30} />

      <div className="relative z-10 flex items-start gap-6">
        <div className="flex-shrink-0">
          <IconPulse Icon={Icon} color={color} />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h3
              className="text-3xl font-[family-name:var(--blender-bold)] text-white mb-4"
              style={{ textShadow: `0 0 20px ${color}50` }}
            >
              {title}
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">{description}</p>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div
              className="px-6 py-3 rounded-xl glass-effect"
              style={{
                boxShadow: `0 0 30px ${color}30`,
                border: `2px solid ${color}30`,
              }}
            >
              <span
                className="text-2xl font-[family-name:var(--blender-bold)] text-white"
                style={{ textShadow: `0 0 10px ${color}` }}
              >
                {stats}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-0 right-0 w-32 h-32 opacity-20"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, ${color}, transparent)`,
              filter: "blur(40px)",
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

