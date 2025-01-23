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
      className={`
        achievement-card p-6 rounded-xl transition-all duration-300 shadow-lg relative
        ${
          userAchievement.completed
            ? "bg-green-900/30 border-2 border-green-600"
            : "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
        }
      `}
    >
      {/* Header */}
      <div
        className="flex items-center mb-4 cursor-pointer"
        onClick={() => onToggleExpand(achievement.id)}
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
        {isExpanded ? (
          <ChevronUp className="text-gray-400" />
        ) : (
          <ChevronDown className="text-gray-400" />
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
        <motion.div
          className={`h-2.5 rounded-full ${
            userAchievement.completed ? "bg-green-500" : "bg-gray-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${userAchievement.progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Progress Text */}
      <div className="flex justify-between text-sm text-gray-400">
        <span>Progreso</span>
        <span>
          {userAchievement.stepsProgress}/{achievement.stepsFinal}
        </span>
      </div>

      {/* Status */}
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

      {/* Expanded Content */}
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
              {/* Steps */}
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
                    onClick={() => canSelect && onStepComplete(achievement.id, stepNumber)}
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

              {/* Step Pagination */}
              {achievement.stepsFinal > stepsPerPage && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStepPageChange(achievement.id, currentStepPage - 1)}
                    disabled={currentStepPage === 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                        currentStepPage === 1
                          ? "text-gray-600 cursor-not-allowed"
                          : "hover:scale-150"
                      } transition-colors`}
                    >
                      <ChevronLeft />
                    </motion.button>
  
                    <span className="text-white text-sm">
                      {currentStepPage} / {totalStepPages}
                    </span>
  
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onStepPageChange(achievement.id, currentStepPage + 1)}
                      disabled={currentStepPage === totalStepPages}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentStepPage === totalStepPages
                          ? "cursor-not-allowed"
                          : "hover:scale-150"
                      } text-white transition-colors`}
                    >
                      <ChevronRight />
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