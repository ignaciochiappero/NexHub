//components/premiosForm/PremiosList.tsx
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#353535]/50 backdrop-blur-sm rounded-xl border border-gray-800 
                     hover:border-pink-500/30 transition-all flex flex-col h-full 
                     shadow-lg"
          >
            <div className="flex-grow p-6">
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                <Image
                  src={premio.imagen || "/placeholder.svg"}
                  alt={premio.titulo}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                  style={{ boxShadow: "0 0 20px rgba(236,72,153,0.3)" }}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">{premio.titulo}</h2>
                <p className="text-gray-300 text-sm">{premio.subtitulo}</p>
                <p className="text-gray-400 text-sm">{premio.descripcion}</p>
              </div>
            </div>

            <div className="flex justify-between p-6 pt-4 mt-auto border-t border-gray-800">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeleteId(premio.id)}
                className="bg-[#404040] hover:bg-[#454545] text-white 
                         px-4 py-2 rounded-xl shadow-md transition-all 
                         flex items-center hover:text-red-500"
              >
                <Trash2 className="mr-2" size={18} />
                Eliminar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(premio)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 
                         hover:from-pink-700 hover:to-purple-700 text-white 
                         px-4 py-2 rounded-xl shadow-md transition-all 
                         flex items-center"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#353535]/90 backdrop-blur-sm rounded-xl p-8 
                       max-w-sm w-full shadow-xl border border-gray-800"
            >
              <div className="flex items-center mb-6">
                <AlertCircle className="text-pink-500 mr-4" size={32} />
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
                  className="bg-[#404040] hover:bg-[#454545] text-white 
                           px-6 py-3 rounded-xl shadow-md transition-all text-lg"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteId && handleDelete(deleteId)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 
                           hover:from-pink-700 hover:to-purple-700 text-white 
                           px-6 py-3 rounded-xl shadow-md transition-all 
                           flex items-center text-lg"
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