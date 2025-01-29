"use client"

import { motion } from "framer-motion"
import type React from "react" // Import React

interface IconPulseProps {
  Icon: React.ElementType
  color: string
}

export const IconPulse = ({ Icon, color }: IconPulseProps) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
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
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
        }}
      >
        <Icon
          className="w-16 h-16"
          style={{
            color,
            filter: `blur(8px) brightness(1.5)`,
          }}
        />
      </motion.div>
      <Icon
        className="w-16 h-16 relative z-10"
        style={{
          color,
          filter: `drop-shadow(0 0 20px ${color})`,
        }}
      />
    </motion.div>
  )
}

