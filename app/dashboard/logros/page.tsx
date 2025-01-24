//app\dashboard\logros\page.tsx

//app/dashboard/logros/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Achievement, ConfirmationModalType } from "./components/types";
import { AchievementCard } from "./components/AchievementCard";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { Pagination } from "./components/Pagination";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

export default function LogrosPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalType | null>(null);
  const [expandedAchievement, setExpandedAchievement] = useState<number | null>(
    null
  );
  const achievementsRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [stepPages, setStepPages] = useState<{ [key: number]: number }>({});
  const achievementsPerPage = 6;
  const stepsPerPage = 5;

  const indexOfLastAchievement = currentPage * achievementsPerPage;
  const indexOfFirstAchievement = indexOfLastAchievement - achievementsPerPage;
  const currentAchievements = achievements.slice(
    indexOfFirstAchievement,
    indexOfLastAchievement
  );

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        expandedAchievement !== null &&
        achievementsRef.current &&
        !achievementsRef.current.contains(event.target as Node)
      ) {
        setExpandedAchievement(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedAchievement]);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/achievements");
      if (!response.ok) throw new Error("Error al obtener logros");
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error("Error al cargar logros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepCompletion = async (achievementId: number, step: number) => {
    setConfirmationModal({ show: true, achievementId, step });
  };

  const confirmStepCompletion = async () => {
    if (!confirmationModal) return;

    try {
      const response = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logroId: confirmationModal.achievementId,
          step: confirmationModal.step,
        }),
      });

      if (!response.ok) throw new Error("Error al enviar la solicitud");

      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) =>
          achievement.id === confirmationModal.achievementId
            ? {
                ...achievement,
                achievements: [
                  {
                    ...achievement.achievements[0],
                    pendingSteps: [
                      ...(achievement.achievements[0]?.pendingSteps || []),
                      confirmationModal.step,
                    ],
                  },
                ],
              }
            : achievement
        )
      );
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setConfirmationModal(null);
    }
  };

  const toggleAchievementExpansion = (achievementId: number) => {
    setExpandedAchievement((prevId) =>
      prevId === achievementId ? null : achievementId
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedAchievement(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepPageChange = (achievementId: number, page: number) => {
    setStepPages((prev) => ({
      ...prev,
      [achievementId]: page,
    }));
  };
  // En //app/dashboard/logros/page.tsx
  return (
    <div className="min-h-screen p-8 pt-20 pb-24 font-[family-name:var(--blender-medium)] relative">
      <div className="max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-theme(spacing.20))]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-5xl text-white flex items-center">
            <Trophy className="mr-4 text-pink-500" size={48} />
            Mis Logros
          </h1>
        </motion.div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="flex flex-col flex-grow">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative flex-grow"
              ref={achievementsRef}
            >
              {currentAchievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isExpanded={expandedAchievement === achievement.id}
                  index={index}
                  onToggleExpand={toggleAchievementExpansion}
                  onStepComplete={handleStepCompletion}
                  stepPages={stepPages}
                  onStepPageChange={handleStepPageChange}
                  stepsPerPage={stepsPerPage}
                />
              ))}
            </motion.div>

            {achievements.length > achievementsPerPage && (
              <div className="mt-auto pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalItems={achievements.length}
                  itemsPerPage={achievementsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!confirmationModal}
        onClose={() => setConfirmationModal(null)}
        onConfirm={confirmStepCompletion}
      />
    </div>
  );
}
