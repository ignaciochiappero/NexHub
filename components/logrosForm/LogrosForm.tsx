//components\logrosForm\LogrosForm.tsx'use client'
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Pen, Book, X, Target, Gift } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import IconSelector from './IconSelector';

interface LogrosFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLogroAdded: () => void;
}

interface Premio {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen: string;
}

function LogrosForm({ isOpen, onClose, onLogroAdded }: LogrosFormProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      icon: 'Trophy',
      stepsFinal: 1,
      premioIds: [] as number[],
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [premios, setPremios] = useState<Premio[]>([]);
  const [selectedPremios, setSelectedPremios] = useState<number[]>([]);

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        const response = await axios.get('/api/premios');
        setPremios(response.data);
      } catch (error) {
        console.error('Error fetching premios:', error);
      }
    };

    if (isOpen) {
      fetchPremios();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    setError(null);
    
    const data = {
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      stepsFinal: Number(formData.stepsFinal),
      completed: false,
      premioIds: selectedPremios,
    };

    try {
      const response = await axios.post('/api/logros', data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 201) {
        onLogroAdded();
        reset();
        setSelectedPremios([]);
        onClose();
      }
    } catch (error: any) {
      console.error('Add logro error:', error);
      setError(error.response?.data?.error || 'Error al crear el logro');
    } finally {
      setIsLoading(false);
    }
  });

  const togglePremio = (premioId: number) => {
    setSelectedPremios(prev => 
      prev.includes(premioId)
        ? prev.filter(id => id !== premioId)
        : [...prev, premioId]
    );
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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

              <h2 className="font-blender-mayus text-3xl text-white mb-6">Registro Logro</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'El título es requerido' }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <Pen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Título Logro"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.title && (
                        <span className="text-sm text-red-500 mt-1">{errors.title.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'La descripción es requerida' }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Descripción del logro"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.description && (
                        <span className="text-sm text-red-500 mt-1">{errors.description.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                <Controller
                  name="icon"
                  control={control}
                  rules={{ required: 'El ícono es requerido' }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <IconSelector
                        selectedIcon={field.value}
                        onSelect={(icon: unknown) => field.onChange(icon)}
                      />
                      {errors.icon && (
                        <span className="text-sm text-red-500 mt-1">{errors.icon.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                <Controller
                  name="stepsFinal"
                  control={control}
                  rules={{ 
                    required: 'El número de pasos es requerido',
                    min: { value: 1, message: 'Mínimo 1 paso' },
                    max: { value: 100, message: 'Máximo 100 pasos' }
                  }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative"
                    >
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Número de pasos para completar"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        min="1"
                        max="100"
                        value={value}
                        onChange={e => onChange(Number(e.target.value))}
                        {...field}
                      />
                      {errors.stepsFinal && (
                        <span className="text-sm text-red-500 mt-1">{errors.stepsFinal.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-white flex items-center gap-2 mb-2">
                    <Gift size={20} />
                    Premios asociados
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {premios.map((premio) => (
                      <motion.div
                        key={premio.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                          p-3 rounded-lg cursor-pointer transition-all
                          ${selectedPremios.includes(premio.id)
                            ? 'bg-pink-600/20 border-2 border-pink-500'
                            : 'bg-[#353535] hover:bg-[#404040] border-2 border-transparent'
                          }
                        `}
                        onClick={() => togglePremio(premio.id)}
                      >
                        <div className="flex items-center gap-3">
                          {premio.imagen && (
                            <img
                              src={premio.imagen}
                              alt={premio.titulo}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-white font-medium">{premio.titulo}</h3>
                            <p className="text-gray-400 text-sm">{premio.subtitulo}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all font-geist-sans disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Agregando...' : 'Agregar logro'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LogrosForm;