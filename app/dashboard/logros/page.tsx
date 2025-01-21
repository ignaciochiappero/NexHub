/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, CheckCircle, Target, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  stepsFinal: number
  achievements: UserAchievement[]
}

interface UserAchievement {
  stepsProgress: number
  progress: number
  completed: boolean
  pendingSteps?: number[]
}

export default function LogrosPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmationModal, setConfirmationModal] = useState<{
    show: boolean
    achievementId: number
    step: number
  } | null>(null)
  const [expandedAchievement, setExpandedAchievement] = useState<number | null>(null)
  const achievementsRef = useRef<HTMLDivElement>(null)

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const achievementsPerPage = 6;

  // Agregar estos estados junto a los demás estados del componente
  const [stepPages, setStepPages] = useState<{ [key: number]: number }>({});
  const stepsPerPage = 5;


  // Agregar esta función junto a las demás funciones del componente
  const paginateSteps = (achievementId: number, pageNumber: number) => {
    setStepPages(prev => ({
      ...prev,
      [achievementId]: pageNumber
    }));
};

  

      // Cálculo de la paginación
  const indexOfLastAchievement = currentPage * achievementsPerPage;
  const indexOfFirstAchievement = indexOfLastAchievement - achievementsPerPage;
  const currentAchievements = achievements.slice(indexOfFirstAchievement, indexOfLastAchievement);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalPages = Math.ceil(achievements.length / achievementsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setExpandedAchievement(null); // Cerrar cualquier logro expandido al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  


  useEffect(() => {
    fetchAchievements()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        expandedAchievement !== null &&
        achievementsRef.current &&
        !achievementsRef.current.contains(event.target as Node)
      ) {
        setExpandedAchievement(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [expandedAchievement])

  const fetchAchievements = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/achievements")
      if (!response.ok) throw new Error("Error al obtener logros")
      const data = await response.json()
      setAchievements(data)
    } catch (error) {
      console.error("Error al cargar logros:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStepCompletion = async (achievementId: number, step: number) => {
    setConfirmationModal({ show: true, achievementId, step })
  }

  const confirmStepCompletion = async () => {
    if (!confirmationModal) return

    try {
      const response = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logroId: confirmationModal.achievementId,
          step: confirmationModal.step,
        }),
      })

      if (!response.ok) throw new Error("Error al enviar la solicitud")

      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) =>
          achievement.id === confirmationModal.achievementId
            ? {
                ...achievement,
                achievements: [
                  {
                    ...achievement.achievements[0],
                    pendingSteps: [...(achievement.achievements[0]?.pendingSteps || []), confirmationModal.step],
                  },
                ],
              }
            : achievement,
        ),
      )
    } catch (error) {
      console.error("Error al enviar la solicitud:", error)
    } finally {
      setConfirmationModal(null)
    }
  }

  const toggleAchievementExpansion = (achievementId: number) => {
    setExpandedAchievement((prevId) => (prevId === achievementId ? null : achievementId))
  }

  const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
    const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<any>
    return IconComponent ? <IconComponent {...props} /> : null
  }

  return (
    <div className="min-h-screen p-8 pt-40 font-[family-name:var(--blender-medium)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-5xl text-white flex items-center">
            <Trophy className="mr-4 text-yellow-500" size={48} />
            Mis Logros
          </h1>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </motion.div>
            ))}
          </div>
        ) : (
            <>
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative" ref={achievementsRef}>
                <AnimatePresence>
                  {currentAchievements.map((achievement, index) => {
                    const userAchievement = achievement.achievements[0] || {
                      stepsProgress: 0,
                      progress: 0,
                      completed: false,
                      pendingSteps: [],
                    }
                    const isExpanded = expandedAchievement === achievement.id
                    return (
                      <motion.div
                        key={achievement.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`
                          achievement-card p-6 rounded-xl transition-all duration-300 shadow-lg relative
                          ${
                            userAchievement.completed
                              ? "bg-green-900/30 border-2 border-green-600"
                              : "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
                          }
                        `}
                      >
                        <div
                          className="flex items-center mb-4 cursor-pointer"
                          onClick={() => toggleAchievementExpansion(achievement.id)}
                        >
                          <div
                            className={`
                            mr-4 w-12 h-12 flex items-center justify-center
                            ${userAchievement.completed ? "text-green-500" : "text-gray-500"}
                          `}
                          >
                            <DynamicIcon name={achievement.icon} size={32} />
                          </div>
                          <div className="flex-grow">
                            <h2
                              className={`
                              text-xl font-bold
                              ${userAchievement.completed ? "text-green-300" : "text-white"}
                            `}
                            >
                              {achievement.title}
                            </h2>
                            <p className="text-gray-400">{achievement.description}</p>
                          </div>
                          {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                        </div>

                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
                          <motion.div
                            className={`
                              h-2.5 rounded-full
                              ${userAchievement.completed ? "bg-green-500" : "bg-gray-500"}
                            `}
                            initial={{ width: 0 }}
                            animate={{ width: `${userAchievement.progress}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          ></motion.div>
                        </div>

                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Progreso</span>
                          <span>
                            {userAchievement.stepsProgress}/{achievement.stepsFinal}
                          </span>
                        </div>

                        {userAchievement.completed ? (
                          <div className="flex items-center text-green-500 mt-4">
                            <CheckCircle className="mr-2" />
                            Completado
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-500 mt-4">
                            <Target className="mr-2" />
                            En curso
                          </div>
                        )}

                        <AnimatePresence>
                          {isExpanded && !userAchievement.completed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="absolute left-0 right-0 top-full mt-2 bg-gray-800 rounded-xl p-4 shadow-lg z-10"
                            >
<div className="space-y-2">
  {/* Pasos paginados */}
  {(() => {
    const currentStepPage = stepPages[achievement.id] || 1;
    const indexOfLastStep = currentStepPage * stepsPerPage;
    const indexOfFirstStep = indexOfLastStep - stepsPerPage;
    const currentSteps = [...Array(achievement.stepsFinal)].slice(indexOfFirstStep, indexOfLastStep);
    const totalStepPages = Math.ceil(achievement.stepsFinal / stepsPerPage);

    return (
      <>
        {currentSteps.map((_, arrayIndex) => {
          const step = arrayIndex + indexOfFirstStep;
          const stepNumber = step + 1;
          const isPending = userAchievement.pendingSteps?.includes(stepNumber) || false;
          const isCompleted = stepNumber <= userAchievement.stepsProgress;
          const canSelect = stepNumber === userAchievement.stepsProgress + 1 && !isPending;

          return (
            <motion.button
              key={step}
              whileHover={{ scale: canSelect ? 1.05 : 1 }}
              whileTap={{ scale: canSelect ? 0.95 : 1 }}
              onClick={() => canSelect && handleStepCompletion(achievement.id, stepNumber)}
              disabled={!canSelect}
              className={`w-full py-2 px-4 rounded-md text-white transition-colors duration-300 ${
                isCompleted
                  ? "bg-green-600 hover:bg-green-700"
                  : isPending
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : canSelect
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-gray-800 cursor-not-allowed"
              }`}
            >
              {isCompleted ? (
                <span className="flex items-center justify-center">
                  <CheckCircle className="mr-2" size={16} />
                  Completado
                </span>
              ) : isPending ? (
                <span className="flex items-center justify-center">
                  <AlertCircle className="mr-2" size={16} />
                  Pendiente
                </span>
              ) : (
                `Completar Paso ${stepNumber}`
              )}
            </motion.button>
          );
        })}

        {/* Paginación de pasos */}
        {achievement.stepsFinal > stepsPerPage && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginateSteps(achievement.id, currentStepPage - 1)}
              disabled={currentStepPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${
                currentStepPage === 1
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-500'
              } text-white transition-colors`}
            >
              ←
            </motion.button>

            <span className="text-white text-sm">
              {currentStepPage} / {totalStepPages}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginateSteps(achievement.id, currentStepPage + 1)}
              disabled={currentStepPage === totalStepPages}
              className={`px-3 py-1 rounded-md text-sm ${
                currentStepPage === totalStepPages
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-500'
              } text-white transition-colors`}
            >
              →
            </motion.button>
          </div>
        )}
      </>
    );
  })()}
</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
              
              {achievements.length > 5 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-500'
                    } text-white transition-colors`}
                  >
                    Anterior
                  </motion.button>

                  <div className="flex space-x-2">
                    {[...Array(Math.ceil(achievements.length / 5))].map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-pink-600'
                            : 'bg-gray-600 hover:bg-gray-500'
                        } text-white transition-colors`}
                      >
                        {index + 1}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => currentPage < Math.ceil(achievements.length / 5) && paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(achievements.length / 5)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === Math.ceil(achievements.length / 5)
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-500'
                    } text-white transition-colors`}
                  >
                    Siguiente
                  </motion.button>
                </div>
              )}
            </>
        )}
      </div>

      <AnimatePresence>
        {confirmationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <AlertCircle className="text-yellow-500 mr-4" size={32} />
                <h2 className="text-3xl font-bold text-white">Confirmar Paso</h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg">
                ¿Estás seguro de que quieres marcar este paso como pendiente?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirmationModal(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full shadow-md transition-colors duration-300 text-lg"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmStepCompletion}
                  className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-full shadow-md transition-colors duration-300 flex items-center text-lg"
                >
                  <AlertCircle className="mr-2" size={20} />
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

