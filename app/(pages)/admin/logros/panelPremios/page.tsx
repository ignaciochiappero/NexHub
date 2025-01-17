'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Gift } from 'lucide-react'
import PremioForm from '@/components/premiosForm/PremiosForm'
import PremioList from '@/components/premiosForm/PremiosList'

export default function AdminPremiosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [premios, setPremios] = useState([])

  const fetchPremios = async () => {
    try {
      const response = await fetch('/api/premios')
      if (!response.ok) throw new Error('Error al obtener Premios')
      const data = await response.json()
      setPremios(data)
    } catch (error) {
      console.error('Error al cargar premios:', error)
    }
  }

  useEffect(() => {
    fetchPremios()
  }, [])

  return (
    <div className="min-h-screen bg-[#242424] p-8 pt-40 font-[family-name:var(--blender-medium)]">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-5xl text-white flex items-center">
            <Gift className="mr-4 text-yellow-500" size={48} />
            Administrar Premios
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/25 transition-all flex items-center text-lg"
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
            className="w-full px-6 py-4 pl-14 rounded-full shadow-lg border border-gray-700 bg-[#181818] text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </motion.div>

        <PremioList premios={premios} searchTerm={searchTerm} onPremioDeleted={fetchPremios} />

        <PremioForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onPremioAdded={fetchPremios}
        />
      </div>
    </div>
  )
}

