//app/dashboard/logros/components/AchievementCard.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Target,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";
import { Achievement } from "./types";

interface AchievementCardProps {
  achievement: Achievement;
  isExpanded: boolean;
  index: number;
  onToggleExpand: (id: number) => void;
  onStepComplete: (achievementId: number, step: number) => void;
  stepPages: { [key: number]: number };
  onStepPageChange: (achievementId: number, page: number) => void;
  stepsPerPage: number;
}

export const AchievementCard = ({
  achievement,
  isExpanded,
  index,
  onToggleExpand,
  onStepComplete,
  stepPages,
  onStepPageChange,
  stepsPerPage
}: AchievementCardProps) => {
  const userAchievement = achievement.achievements[0] || {
    stepsProgress: 0,
    progress: 0,
    completed: false,
    pendingSteps: []
  };

  const currentStepPage = stepPages[achievement.id] || 1;
  const indexOfLastStep = currentStepPage * stepsPerPage;
  const indexOfFirstStep = indexOfLastStep - stepsPerPage;
  const currentSteps = [...Array(achievement.stepsFinal)].slice(
    indexOfFirstStep,
    indexOfLastStep
  );
  const totalStepPages = Math.ceil(achievement.stepsFinal / stepsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative"
    >
      <motion.div
        className={`
          achievement-card p-5 rounded-xl transition-all duration-300 shadow-lg
          ${
            userAchievement.completed
              ? "bg-[#353535]/50 backdrop-blur-sm border-2 border-teal-500/30"
              : "bg-[#353535]/50 backdrop-blur-sm hover:bg-[#404040]/50"
          }
          ${isExpanded ? 'z-20' : 'z-10'}
        `}
        style={
          userAchievement.completed
            ? { boxShadow: "0 0 30px rgba(20,184,166,0.3)" }
            : undefined
        }
      >
        {/* Header */}
        <div
          className="flex items-center mb-3 cursor-pointer"
          onClick={() => onToggleExpand(achievement.id)}
        >
          <div
            className={`
              mr-4 w-10 h-10 flex items-center justify-center
              ${userAchievement.completed ? "text-teal-500" : "text-gray-400"}
            `}
          >
            <DynamicIcon name={achievement.icon} size={24} />
          </div>
          <div className="flex-grow">
            <h2
              className={`
                text-lg font-bold mb-0.5
                ${userAchievement.completed ? "text-teal-400" : "text-white"}
              `}
            >
              {achievement.title}
            </h2>
            <p className="text-gray-400 text-sm">{achievement.description}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="text-gray-400" size={20} />
          ) : (
            <ChevronDown className="text-gray-400" size={20} />
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
          <motion.div
            className={`h-2 rounded-full ${
              userAchievement.completed 
                ? "bg-gradient-to-r from-teal-500 to-cyan-500" 
                : "bg-gray-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${userAchievement.progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progreso</span>
          <span>
            {userAchievement.stepsProgress}/{achievement.stepsFinal}
          </span>
        </div>

        {/* Status */}
        {userAchievement.completed ? (
          <div className="flex items-center text-teal-500 mt-3 text-sm">
            <CheckCircle className="mr-2" size={16} />
            Completado
          </div>
        ) : (
          <div className="flex items-center text-pink-500 mt-3 text-sm">
            <Target className="mr-2" size={16} />
            En curso
          </div>
        )}
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && !userAchievement.completed && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 bg-[#353535]/90 backdrop-blur-sm 
                     rounded-xl p-4 shadow-lg border border-gray-800 
                     hover:border-pink-500/30 z-50 mt-2 origin-top"
            style={{
              width: '100%',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            <div className="space-y-2">
              {currentSteps.map((_, arrayIndex) => {
                const step = arrayIndex + indexOfFirstStep;
                const stepNumber = step + 1;
                const isPending = userAchievement.pendingSteps?.includes(stepNumber) || false;
                const isCompleted = stepNumber <= userAchievement.stepsProgress;
                const canSelect = stepNumber === userAchievement.stepsProgress + 1 && !isPending;

                return (
                  <motion.button
                    key={step}
                    whileHover={{ scale: canSelect ? 1.02 : 1 }}
                    whileTap={{ scale: canSelect ? 0.98 : 1 }}
                    onClick={() => canSelect && onStepComplete(achievement.id, stepNumber)}
                    disabled={!canSelect}
                    className={`w-full py-2.5 px-4 rounded-xl text-white text-sm transition-all duration-300 
                              ${
                                isCompleted
                                  ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                                  : isPending
                                    ? "bg-purple-600"
                                    : canSelect
                                      ? "bg-[#404040] hover:bg-[#454545]"
                                      : "bg-gray-800/50 cursor-not-allowed"
                              }`}
                  >
                    {isCompleted ? (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="mr-2" size={14} />
                        Completado
                      </span>
                    ) : isPending ? (
                      <span className="flex items-center justify-center">
                        <AlertCircle className="mr-2" size={14} />
                        Pendiente
                      </span>
                    ) : (
                      `Completar Paso ${stepNumber}`
                    )}
                  </motion.button>
                );
              })}

              {achievement.stepsFinal > stepsPerPage && (
                <div className="flex justify-center items-center mt-3 space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStepPageChange(achievement.id, currentStepPage - 1)}
                    disabled={currentStepPage === 1}
                    className={`p-1.5 rounded-lg transition-colors
                              ${currentStepPage === 1
                                ? "text-gray-600 cursor-not-allowed"
                                : "text-pink-500 hover:text-pink-400"
                              }`}
                  >
                    <ChevronLeft size={16} />
                  </motion.button>

                  <span className="text-white text-sm">
                    {currentStepPage} / {totalStepPages}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStepPageChange(achievement.id, currentStepPage + 1)}
                    disabled={currentStepPage === totalStepPages}
                    className={`p-1.5 rounded-lg transition-colors
                              ${currentStepPage === totalStepPages
                                ? "text-gray-600 cursor-not-allowed"
                                : "text-pink-500 hover:text-pink-400"
                              }`}
                  >
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};