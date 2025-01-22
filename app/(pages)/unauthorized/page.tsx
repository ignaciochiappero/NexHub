// app/(pages)/unauthorized/page.tsx

"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="font-[family-name:var(--blender-medium)] min-h-screen bg-[#1a1a1a] text-white overflow-hidden px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Shield className="w-24 h-24 mx-auto text-pink-500" />
          </motion.div>

          <motion.h1 
            className="text-6xl font-blender-mayus bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Acceso No Autorizado
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-xl mb-12"
          >
            Lo sentimos, no tienes permisos para acceder a esta página.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/">
              <motion.button
                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 rounded-xl font-medium mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Inicio
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative rounded-2xl bg-[#242424] p-8 mt-12 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative z-10 text-center">
            <p className="text-gray-400">
              Si crees que esto es un error, por favor contacta al administrador del sistema.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}