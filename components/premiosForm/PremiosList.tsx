import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Trash2, Edit2 } from 'lucide-react'

interface Premio {
  id: number
  titulo: string
  subtitulo: string
  descripcion: string
  imagen: string
}

interface PremioListProps {
  premios: Premio[]
  searchTerm: string
  onPremioDeleted: () => void
}

export default function PremioList({ premios, searchTerm, onPremioDeleted }: PremioListProps) {
  const filteredPremios = premios.filter(
    (premio) =>
      premio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      premio.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      premio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/premios/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Error al eliminar el premio")
      onPremioDeleted()
    } catch (error) {
      console.error("Error al eliminar premio:", error)
      alert("Hubo un problema al eliminar el premio")
    }
  }

  return (
    <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {filteredPremios.map((premio, index) => (
          <motion.div
            key={premio.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-[#353535] hover:bg-[#454545] p-6 rounded-xl transition-all duration-300"
          >
            <div className="mb-4">
              <Image
                src={premio.imagen || "/placeholder.svg"}
                alt={premio.titulo}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{premio.titulo}</h2>
            <p className="text-gray-300 mb-2">{premio.subtitulo}</p>
            <p className="text-gray-400 mb-4">{premio.descripcion}</p>
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(premio.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center"
              >
                <Trash2 className="mr-2" size={18} />
                Eliminar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center"
              >
                <Edit2 className="mr-2" size={18} />
                Editar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

