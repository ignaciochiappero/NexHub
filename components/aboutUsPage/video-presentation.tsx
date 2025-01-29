"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pause, RotateCcw, VolumeX, Volume1, Volume2, Minimize2, Maximize2, Play } from "lucide-react"
import TechPlayIcon from "./icons/TechPlayIcon"

export const VideoPresentation = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
        setHasStartedPlaying(true)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    const hideControlsTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (isPlaying) {
        timeoutRef.current = setTimeout(() => setShowControls(false), 3000)
      }
    }

    hideControlsTimer()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isPlaying])

  const handleMouseMove = () => {
    setShowControls(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      >
        <source src="/NexHub-Presentation.mp4" type="video/mp4" />
      </video>

      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                whileHover="hover"
              >
                {/* Primer efecto de brillo (más grande y difuso) */}
                <motion.div
                  className="absolute inset-0 -z-10 rounded-full bg-stone-100/20 blur-3xl"
                  variants={{
                    hover: {
                      scale: 3,
                      opacity: 0.8,
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                    initial: {
                      scale: 0,
                      opacity: 0,
                    }
                  }}
                  initial="initial"
                  animate="initial"
                  transition={{
                    duration: 0.4,
                  }}
                />
                
                {/* Segundo efecto de brillo (más pequeño y concentrado) */}
                <motion.div
                  className="absolute inset-0 -z-10 rounded-full bg-stone-50/40 blur-xl"
                  variants={{
                    hover: {
                      scale: 1.8,
                      opacity: 0.9,
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                    },
                    initial: {
                      scale: 0,
                      opacity: 0,
                    }
                  }}
                  initial="initial"
                  animate="initial"
                  transition={{
                    duration: 0.3,
                  }}
                />
                
                <motion.button
                  onClick={togglePlay}
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-stone-200" />
                  ) : (
                    <TechPlayIcon className="w-32 h-32" />
                  )}
                </motion.button>
              </motion.div>
            </div>

            {hasStartedPlaying && (
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center space-x-4">
                <motion.button
                  onClick={togglePlay}
                  className="text-stone-200 hover:text-stone-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>

                <motion.button
                  onClick={restartVideo}
                  className="text-stone-200 hover:text-stone-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>

                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={toggleMute}
                    className="text-stone-200 hover:text-stone-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-6 h-6" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </motion.button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-stone-300 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-stone-300"
                  />
                </div>

                <div className="flex-grow" />

                <motion.button
                  onClick={toggleFullscreen}
                  className="text-stone-200 hover:text-stone-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}