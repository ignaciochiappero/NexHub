"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconPulse } from "./icon-pulse"
import type React from "react" // Added import for React

interface FeatureProps {
  frontIcon: React.ElementType
  frontTitle: string
  backTitle: string
  backDescription: string
  color: string
}

export const FlipCard = ({ frontIcon: Icon, frontTitle, backTitle, backDescription, color }: FeatureProps) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className="relative w-full h-[400px] cursor-pointer rounded-2xl"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-all duration-300 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden">
          <div
            className="w-full h-full p-8 flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm rounded-2xl"
            style={{
              boxShadow: `0 0 30px ${color}30`,
              border: `2px solid ${color}30`,
            }}
          >
            <IconPulse Icon={Icon} color={color} />
            <h3
              className="text-2xl font-[family-name:var(--blender-bold)] text-center text-white"
              style={{ textShadow: `0 0 10px ${color}` }}
            >
              {frontTitle}
            </h3>
          </div>
        </div>

        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
          <div
            className="w-full h-full p-8 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm rounded-2xl"
            style={{
              boxShadow: `0 0 30px ${color}30`,
              border: `2px solid ${color}30`,
            }}
          >
            <h3
              className="text-xl font-[family-name:var(--blender-bold)] text-white mb-4 text-center"
              style={{ textShadow: `0 0 10px ${color}` }}
            >
              {backTitle}
            </h3>
            <p className="text-gray-200 text-center font-[family-name:var(--blender-medium)] leading-relaxed">
              {backDescription}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

