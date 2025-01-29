"use client"

import { motion } from "framer-motion"

interface AnimatedBadgeProps {
  text: string
  color: string
}

export const AnimatedBadge = ({ text, color }: AnimatedBadgeProps) => {
  return (
    <motion.div
      className="px-6 py-3 rounded-full backdrop-blur-lg relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        border: `2px solid ${color}30`,
        boxShadow: `0 0 20px ${color}30`,
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `linear-gradient(0deg, ${color}00, ${color}20)`,
            `linear-gradient(180deg, ${color}00, ${color}20)`,
            `linear-gradient(360deg, ${color}00, ${color}20)`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <span className="relative z-10 text-white font-[family-name:var(--blender-medium)]">{text}</span>
    </motion.div>
  )
}

