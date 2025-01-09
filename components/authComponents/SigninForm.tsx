"use client"

import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function SigninForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" }
  });
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    setAuthError('');
    setIsLoading(true);
    
    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    });
    
    if (!res?.ok) {
      setAuthError('Usuario o contraseña incorrectos');
      setIsLoading(false);
    } else {
      const loadingDuration = 1000;
      await new Promise(resolve => setTimeout(resolve, loadingDuration));
      router.push('/dashboard/profile');
    }
  });

  const errorVariants = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { opacity: 1, y: 0, height: 'auto' },
    exit: { opacity: 0, y: -10, height: 0 }
  };

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex h-screen w-full mx-auto text-white px-4 sm:px-20">
      <div className="flex w-full h-full max-h-[calc(100vh-80px)] overflow-hidden items-center justify-center">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              variants={loadingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md h-[400px] rounded-2xl bg-[#242424] shadow-2xl flex flex-col items-center justify-center space-y-6"
            >
              <motion.div
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                className="bg-gradient-to-r from-pink-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-4 border-white border-t-transparent"
                />
              </motion.div>
              <p className="text-xl font-medium text-white">Iniciando sesión...</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-[#242424] shadow-2xl"
            >
              {/* Resto del formulario existente */}
              <form onSubmit={onSubmit} className="p-6 space-y-6">
                  <div className="text-center">
                  <Image 
                    src="/logo 5.png" 
                    alt="Profile" 
                    width={100} 
                    height={100} 
                    className="mx-auto rounded-full mb-4"
                  />
                  <h1 className="text-3xl font-bold text-white">
                    Iniciar Sesión
                  </h1>
                </div>

                <AnimatePresence>
                  {authError && (
                    <motion.div
                      variants={errorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2"
                    >
                      <AlertCircle className="text-red-500 w-5 h-5" />
                      <span className="text-red-500">{authError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Controller 
                  name="email"
                  control={control}
                  rules={{
                    required: {
                      message: "El email es requerido",
                      value: true
                    }
                  }}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email"
                          placeholder="email@domain.com"
                          className={`w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.email ? 'ring-2 ring-red-500/50' : 'focus:ring-pink-500/50'
                          }`}
                          {...field}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.div
                            variants={errorVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-1 px-1"
                          >
                            <AlertCircle className="text-red-500 w-4 h-4" />
                            <span className="text-red-500 text-sm">{errors.email.message}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                />

                <Controller 
                  name="password"
                  control={control}
                  rules={{
                    required: {
                      message: "La contraseña es requerida",
                      value: true
                    },
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener al menos 8 caracteres",
                    },
                  }}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="password"
                          placeholder="Contraseña"
                          className={`w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.password ? 'ring-2 ring-red-500/50' : 'focus:ring-pink-500/50'
                          }`}
                          {...field}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.password && (
                          <motion.div
                            variants={errorVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-1 px-1"
                          >
                            <AlertCircle className="text-red-500 w-4 h-4" />
                            <span className="text-red-500 text-sm">{errors.password.message}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                />

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all text-lg font-semibold"
                >
                  Entrar
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SigninForm;