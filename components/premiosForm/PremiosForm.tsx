"use client"

import { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Pen, Book, X, ImageIcon } from "lucide-react"
import axios from "axios"
import Image from "next/image"

interface PremioFormProps {
  isOpen: boolean
  onClose: () => void
  onPremioAdded: () => void
}

export default function PremioForm({ isOpen, onClose, onPremioAdded }: PremioFormProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      titulo: "",
      subtitulo: "",
      descripcion: "",
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axios.post("/api/upload", formData)
    return response.data.url
  }

  const onSubmit = async (formData: any) => {
    try {
      setIsLoading(true)
      setError(null)

      let imageUrl = null
      if (image) {
        imageUrl = await uploadImage(image)
      }

      const premioData = {
        titulo: formData.titulo,
        subtitulo: formData.subtitulo,
        descripcion: formData.descripcion,
        imagen: imageUrl,
      }

      const response = await axios.post("/api/premios", premioData)

      if (response.status === 201) {
        onPremioAdded()
        reset()
        setImage(null)
        setPreviewUrl(null)
        onClose()
      }
    } catch (error: any) {
      console.error("Add premio error:", error)
      setError(error.response?.data?.error || "Error al crear el premio")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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

              <h2 className="font-blender-mayus text-3xl text-white mb-6">Registro Premio</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                  name="titulo"
                  control={control}
                  rules={{ required: "El título es requerido" }}
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
                        placeholder="Título Premio"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.titulo && (
                        <span className="text-sm text-red-500 mt-1">{errors.titulo.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                <Controller
                  name="subtitulo"
                  control={control}
                  rules={{ required: "El subtítulo es requerido" }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <Pen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Subtítulo Premio"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        {...field}
                      />
                      {errors.subtitulo && (
                        <span className="text-sm text-red-500 mt-1">{errors.subtitulo.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                <Controller
                  name="descripcion"
                  control={control}
                  rules={{ required: "La descripción es requerida" }}
                  render={({ field }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <Book className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        placeholder="Descripción del premio"
                        className="w-full bg-[#353535] text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                        rows={4}
                        {...field}
                      />
                      {errors.descripcion && (
                        <span className="text-sm text-red-500 mt-1">{errors.descripcion.message}</span>
                      )}
                    </motion.div>
                  )}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#353535] text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans flex items-center justify-center"
                  >
                    <ImageIcon className="mr-2" />
                    {previewUrl ? "Cambiar imagen" : "Subir imagen"}
                  </button>
                  {previewUrl && (
                    <div className="mt-2">
                      <Image 
                        src={previewUrl} 
                        alt="Preview" 
                        width={100} 
                        height={100} 
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all font-geist-sans disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Agregando..." : "Agregar premio"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}