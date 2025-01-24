//app/dashboard/logros/components/LoadingSkeleton.tsx
"use client";

import { motion } from "framer-motion";

export const LoadingSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-6 animate-pulse"
        >
          <div className="h-6 bg-[#404040] rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-[#404040] rounded w-1/2"></div>
        </motion.div>
      ))}
    </div>
  );
};