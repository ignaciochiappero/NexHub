//components\authComponents\SignupForm.tsx


'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Lock, User, Mail, Calendar, X, Key, BriefcaseBusiness } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
  userToEdit?: {
    id?: number;
    name: string;
    email: string;
    birthday: string;
    position: string;
    image?: string | null;    
    company?: string | null;  
    location?: string | null;
  } | null;
  isEditing?: boolean;
}

function SignupModal({ isOpen, onClose, onUserAdded, userToEdit, isEditing }: SignupModalProps) {
  
  const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
      changePassword: false,
      name: '',
      birthday: '',
      position: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false)
  const changePassword = watch('changePassword');

  useEffect(() => {
    if (userToEdit) {
      setValue('name', userToEdit.name);
      setValue('email', userToEdit.email);
      setValue('position', userToEdit.position);
      if (userToEdit.birthday) {
        setValue('birthday', new Date(userToEdit.birthday).toISOString().split('T')[0]);
      }
      setValue('changePassword', false);
      setValue('newPassword', '');
      setValue('confirmPassword', '');
    }
  }, [userToEdit, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      
      
      if (isEditing && userToEdit?.id) {

        // Validar contraseñas si se está cambiando
        if (data.changePassword && data.newPassword !== data.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
  
        // Preparar los datos para la actualización
        const updateData = {
          name: data.name,
          email: data.email,
          birthday: data.birthday,  // Ya viene en formato ISO
          position: data.position,
          location: userToEdit.location,
          company: userToEdit.company,   
          image: userToEdit.image,       
          password: '',
        };
  
        // Solo incluir la contraseña si se está cambiando
        if (data.changePassword && data.newPassword) {
          updateData['password'] = data.newPassword;
        }
  
        try {
          const response = await axios.put(`/api/users/${userToEdit.id}`, updateData);
          
          if (response.status === 200) {
            onUserAdded();
            reset();
            onClose();
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (axiosError: any) {
          console.error('Error en la actualización:', axiosError.response?.data || axiosError.message);
          throw new Error(axiosError.response?.data || 'Error al actualizar el usuario');
        }
      }
      
      else {


        // Crear nuevo usuario
        try {
          const response = await axios.post('/api/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
            birthday: data.birthday,
            position: data.position
          });
  
          if (response.status === 200) {
            onUserAdded();

          }

          
          if (response.status === 201) {
            
            reset();
            onClose();
          }

        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (axiosError: any) {
          console.error('Error en el registro:', axiosError.response?.data || axiosError.message);
          throw new Error(axiosError.response?.data || 'Error al crear el usuario');
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(isEditing ? 'Error de actualización:' : 'Error de registro:', error);
      alert(error.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  });

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
              <h2 className="font-blender-mayus text-3xl text-white mb-6">
                {isEditing ? 'Editar Usuario' : 'Registro'}
              </h2>
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
                      {errors.name && (
                        <span className="text-sm text-red-500 mt-1">{errors.name.message}</span>
                      )}
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
                      {errors.email && (
                        <span className="text-sm text-red-500 mt-1">{errors.email.message}</span>
                      )}
                    </motion.div>
                  )}
                />


                <Controller
                  name="position"
                  control={control}
                  rules={{ required: 'El puesto es requerido' }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <BriefcaseBusiness  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cargo en la empresa"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.position && (
                        <span className="text-sm text-red-500 mt-1">{errors.position.message}</span>
                      )}
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
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.birthday && (
                        <span className="text-sm text-red-500 mt-1">{errors.birthday.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                

                {!isEditing ? (
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
                        transition={{ delay: 0.4 }}
                        className="relative"
                      >
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Contraseña"
                          className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                          {...field}
                        />
                        {errors.password && (
                          <span className="text-sm text-red-500 mt-1">{errors.password.message}</span>
                        )}
                      </motion.div>
                    )}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                  <Controller
                    name="changePassword"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <label className="text-white">Cambiar contraseña</label>
                      </div>
                    )}
                  />

                    {changePassword && (
                      <>
                        <Controller
                          name="newPassword"
                          control={control}
                          rules={{
                            required: 'La nueva contraseña es requerida',
                            minLength: {
                              value: 8,
                              message: 'La contraseña debe tener al menos 8 caracteres',
                            },
                          }}
                          render={({ field }) => (
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="password"
                                placeholder="Nueva contraseña"
                                className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                                {...field}
                              />
                              {errors.newPassword && (
                                <span className="text-sm text-red-500 mt-1">{errors.newPassword.message}</span>
                              )}
                            </div>
                          )}
                        />

                        <Controller
                          name="confirmPassword"
                          control={control}
                          rules={{
                            required: 'Confirma la nueva contraseña',
                            validate: (val: string) => {
                              if (watch('newPassword') != val) {
                                return "Las contraseñas no coinciden";
                              }
                            }
                          }}
                          render={({ field }) => (
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="password"
                                placeholder="Confirmar nueva contraseña"
                                className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                                {...field}
                              />
                              {errors.confirmPassword && (
                                <span className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</span>
                              )}
                            </div>
                          )}
                        />
                      </>
                    )}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all font-geist-sans"
                >
                  {isLoading 
                    ? (isEditing ? 'Actualizando...' : 'Registrando...') 
                    : (isEditing ? 'Actualizar usuario' : 'Registrar usuario')}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SignupModal;