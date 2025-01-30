
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Gift, ChevronLeft } from "lucide-react"
import PremioForm from "@/components/premiosForm/PremiosForm"
import PremioList from "@/components/premiosForm/PremiosList"
import Link from "next/link"

interface Premio {
  id: number
  titulo: string
  subtitulo: string
  descripcion: string
  imagen: string
}

export default function AdminPremiosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [premios, setPremios] = useState<Premio[]>([])
  const [premioToEdit, setPremioToEdit] = useState<Premio | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const fetchPremios = async () => {
    try {
      const response = await fetch("/api/premios")
      if (!response.ok) throw new Error("Error al obtener Premios")
      const data = await response.json()
      setPremios(data)
    } catch (error) {
      console.error("Error al cargar premios:", error)
    }
  }

  useEffect(() => {
    fetchPremios()
  }, [])

  const handleEdit = (premio: Premio) => {
    setPremioToEdit(premio)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleModalClose = () => {
    setIsFormOpen(false)
    setPremioToEdit(null)
    setIsEditing(false)
  }

  const handleAddNew = () => {
    setPremioToEdit(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 pt-16 sm:pt-24 font-[family-name:var(--blender-medium)]">
      <Link href="/admin/logros">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white py-3 rounded-xl transition-all flex items-center text-lg
                   hover:text-pink-500"
        >
          <ChevronLeft className="mr-2" size={24} />
          Volver
        </motion.button>
      </Link>

      <div className="max-w-6xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12"
        >
          <h1
            className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-r from-pink-500 to-purple-500 flex items-center mb-4 sm:mb-0"
          >
            <Gift className="mr-4 text-pink-500" size={48} />
            Administrar Premios
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 
                     hover:from-pink-700 hover:to-purple-700 text-white 
                     px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-500/25 
                     transition-all flex items-center justify-center text-lg"
          >
            <Plus className="mr-2" size={24} />
            Agregar premio
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 relative"
        >
          <input
            type="text"
            placeholder="Buscar premios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl shadow-lg border border-gray-700 
                     bg-[#353535]/50 backdrop-blur-sm text-white 
                     focus:outline-none focus:ring-2 focus:ring-pink-500/20 
                     focus:border-pink-500 hover:border-pink-500/30 
                     transition-all text-base sm:text-lg"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </motion.div>

        <PremioList premios={premios} searchTerm={searchTerm} onPremioDeleted={fetchPremios} onEdit={handleEdit} />

        <PremioForm
          isOpen={isFormOpen}
          onClose={handleModalClose}
          onPremioAdded={fetchPremios}
          premioToEdit={premioToEdit}
          isEditing={isEditing}
        />
      </div>
    </div>
  )
}

