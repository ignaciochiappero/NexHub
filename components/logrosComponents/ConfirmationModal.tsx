//app/dashboard/logros/components/ConfirmationModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm }: ConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <AlertCircle className="text-pink-500 mr-4" size={32} />
              <h2 className="text-3xl font-bold text-white">Confirmar Paso</h2>
            </div>
            <p className="text-gray-300 mb-8 text-lg">
              ¿Estás seguro de que quieres marcar este paso como pendiente?
            </p>
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-[#404040] hover:bg-[#454545] text-white px-6 py-3 rounded-xl shadow-md transition-colors duration-300 text-lg"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-md transition-colors duration-300 flex items-center text-lg"
              >
                <AlertCircle className="mr-2" size={20} />
                Confirmar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};