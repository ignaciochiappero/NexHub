'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import SignupModal from '@/components/authComponents/SignupForm';

export default function RegisterPage() {
  const [masterPassword, setMasterPassword] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterPassword === '123456789') {
      setError('');
      setShowSignupForm(true);
    } else {
      setError('Contraseña maestra incorrecta');
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--blender-medium)] bg-[#242424] flex items-center justify-center p-4">
      <AnimatePresence>
        {!showSignupForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-[#181818] rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl text-white mb-8 font-[family-name:var(--blender-medium)]">
              Verificación de Acceso
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Ingrese la contraseña maestra"
                  className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all font-geist-sans"
              >
                Verificar
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <SignupModal
            isOpen={true}
            onClose={() => setShowSignupForm(false)}
            onUserAdded={() => {
              // Manejar la adición del usuario aquí
              setShowSignupForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}