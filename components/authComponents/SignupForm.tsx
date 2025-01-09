//components\authComponents\SignupForm.tsx

'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Lock, User, Mail, Calendar, X } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onUserAdded: () => void
}

function SignupModal({ isOpen, onClose, onUserAdded }: SignupModalProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      birthday: '',
    }
  })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/auth/register', {
        ...data,
        birthday: new Date(data.birthday).toISOString(),
      })

      if (response.status === 201) {
        onUserAdded()
        reset()
        onClose()
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-full max-w-md bg-[#242424] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 relative">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </motion.button>
              <h2 className="font-blender-mayus text-3xl text-white mb-6">Registro</h2>
              <form onSubmit={onSubmit} className="space-y-4">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'El nombre es requerido' }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nombre Usuario"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.name && <span className="text-sm text-red-500 mt-1">{errors.name.message}</span>}
                    </motion.div>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'El email es requerido' }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="email@domain.com"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.email && <span className="text-sm text-red-500 mt-1">{errors.email.message}</span>}
                    </motion.div>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres',
                    },
                  }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.password && <span className="text-sm text-red-500 mt-1">{errors.password.message}</span>}
                    </motion.div>
                  )}
                />

                <Controller
                  name="birthday"
                  control={control}
                  rules={{ required: 'La fecha de nacimiento es requerida' }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative"
                    >
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.birthday && <span className="text-sm text-red-500 mt-1">{errors.birthday.message}</span>}
                    </motion.div>
                  )}
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all font-geist-sans"
                >
                  {isLoading ? 'Registrando...' : 'Registrar usuario'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SignupModal

