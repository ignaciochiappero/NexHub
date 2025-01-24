//app/dashboard/logros/components/Pagination.tsx
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}
export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="w-full flex justify-center items-center space-x-2 bg-background/80 backdrop-blur-sm ">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-xl ${
          currentPage === 1
            ? "bg-[#404040] cursor-not-allowed"
            : "bg-[#404040] hover:bg-[#454545]"
        } text-white transition-colors`}
      >
        <ChevronLeft />
      </motion.button>

      <div className="flex space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(index + 1)}
            className={`w-10 h-10 rounded-xl ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-pink-600 to-purple-600"
                : "bg-[#404040] hover:bg-[#454545]"
            } text-white transition-colors`}
          >
            {index + 1}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-xl ${
          currentPage === totalPages
            ? "bg-[#404040] cursor-not-allowed"
            : "bg-[#404040] hover:bg-[#454545]"
        } text-white transition-colors`}
      >
        <ChevronRight />
      </motion.button>
    </div>
  );
};