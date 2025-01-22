//components\premiosForm\PremiosList.tsx

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Trash2, Edit2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface Premio {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagen: string;
}

interface PremioListProps {
  premios: Premio[];
  searchTerm: string;
  onPremioDeleted: () => void;
  onEdit: (premio: Premio) => void;
}

export default function PremioList({ premios, searchTerm, onPremioDeleted, onEdit }: PremioListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredPremios = premios.filter(
    (premio) =>
      premio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      premio.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      premio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/premios/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el premio");
      onPremioDeleted();
      setDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar premio:", error);
      alert("Hubo un problema al eliminar el premio");
    }
  };

  return (
    <>
      <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPremios.map((premio) => (
          <motion.div
            key={premio.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
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
                onClick={() => setDeleteId(premio.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center"
              >
                <Trash2 className="mr-2" size={18} />
                Eliminar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(premio)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center"
              >
                <Edit2 className="mr-2" size={18} />
                Editar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <AlertCircle className="text-yellow-500 mr-4" size={32} />
                <h2 className="text-3xl font-bold text-white">
                  Confirmar eliminación
                </h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg">
                ¿Estás seguro de que quieres eliminar este premio?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteId(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full shadow-md transition-colors duration-300 text-lg"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteId && handleDelete(deleteId)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-md transition-colors duration-300 flex items-center text-lg"
                >
                  <Trash2 className="mr-2" size={20} />
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}