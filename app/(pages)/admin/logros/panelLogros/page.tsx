//app\(pages)\admin\logros\panelLogros\page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

import { 
  Search, 
  Trash2, 
  Edit2, 
  AlertCircle, 
  Trophy, 
  Plus,
  CheckCircle,
  Target,
  Gauge,
  Star,
  Lock,
  Unlock,
  Medal,
  Rocket,
  Code,
  Globe,
  Database,
  Shield,
  Swords,
  Zap, Heart, Crown, Diamond, Brain, 
  Flame,  Award,  Sparkles,
  Gem, Sword, Book, Compass, Map,
  Mountain, Sun, Moon,  Lightbulb,
  Flag, Crosshair, Eye, Gift,
  ChevronLeft
} from 'lucide-react';
import LogrosForm from "@/components/logrosForm/LogrosForm";
import Link from "next/link";

// Mapeo de strings a componentes de íconos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMapping: { [key: string]: any } = {
  'Gauge': Gauge,
  'Trophy': Trophy,
  'Star': Star,
  'Lock': Lock,
  'Unlock': Unlock,
  'Medal': Medal,
  'Rocket': Rocket,
  'Target': Target,
  'CheckCircle': CheckCircle,
  'Code': Code,
  'Globe': Globe,
  'Database': Database,
  'Shield': Shield,
  'Swords': Swords,
  'Zap': Zap,
  'Heart': Heart,
  'Crown': Crown,
  'Diamond': Diamond,
  'Brain': Brain,
  'Flame': Flame,
  'Award': Award,
  'Sparkles': Sparkles,
  'Gem': Gem,
  'Sword': Sword,
  'Book': Book,
  'Compass': Compass,
  'Map': Map,
  'Mountain': Mountain,
  'Sun': Sun,
  'Moon': Moon,
  'Lightbulb': Lightbulb,
  'Flag': Flag,
  'Crosshair': Crosshair,
  'Eye': Eye,
  'Gift': Gift,
};

interface Logro {
  id: number;
  title: string;
  description: string;
  icon: string;
  stepsProgress: number;
  stepsFinal: number;
  progress: number;
  completed: boolean;
  createdAt: string;

  premios: Premio[];
}

interface Premio {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen: string;
}

export default function AdminUserPage() {
  const [logro, setLogro] = useState<Logro[]>([]);

  const [premio, setPremio] = useState<Premio[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLogroId, setDeleteLogroId] = useState<number | null>(null);
  const [isLogrosFormOpen, setIsLogrosFormOpen] = useState(false);



  const fetchLogros = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/logros");
      if (!response.ok) throw new Error("Error al obtener Logros");
      const data = await response.json();
      setLogro(data);
    } catch (error) {
      console.error("Error al cargar logros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogros();
  }, []);




  const fetchPremios = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/premios");
      if (!response.ok) throw new Error("Error al obtener premios");
      const data = await response.json();
      setPremio(data);
    } catch (error) {
      console.error("Error al cargar premios:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPremios();
  }, []);




  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/logros/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el logro");
      setLogro((prevLogros) => prevLogros.filter((logro) => logro.id !== id));
      setDeleteLogroId(null);
    } catch (error) {
      console.error("Error al eliminar logro:", error);
      alert("Hubo un problema al eliminar el logro");
    }
  };



  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMapping[iconName];
    return IconComponent ? <IconComponent size={48} /> : <Trophy size={48} />;
  };

  const filteredLogros = logro.filter(
    (logros) =>
      logros.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logros.description.toLowerCase().includes(searchTerm.toLowerCase())
  );



  

  return (
    <div className="min-h-screen bg-[#242424] p-8 pt-28 font-[family-name:var(--blender-medium)]">
      
          <Link href="/admin/logros">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
              className=" text-whitepy-3 rounded-full transition-all flex items-center text-lg"
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
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-5xl text-white flex items-center">
            <Trophy className="mr-4 text-yellow-500" size={48} />
            Administrar Logros
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLogrosFormOpen(true)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/25 transition-all flex items-center text-lg"
          >
            <Plus className="mr-2" size={24} />
            Agregar logro
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
            placeholder="Buscar logros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 pl-14 rounded-full shadow-lg border border-gray-700 bg-[#181818] text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              
              {filteredLogros.map((logros, index) => (
                <motion.div
                  key={logros.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`
                    p-6 rounded-xl transition-all duration-300
                    ${logros.completed 
                      ? 'bg-green-900/30 border-2 border-green-600' 
                      : 'bg-[#353535] hover:bg-[#454545]'}
                  `}
                >
                  <div className="flex items-center mb-4">
                    <div className={`
                      mr-4 w-12 h-12 flex items-center justify-center
                      ${logros.completed ? 'text-green-500' : 'text-gray-500'}
                    `}>
                      {getIconComponent(logros.icon)}
                    </div>
                    <div>
                      <h2 className={`
                        text-xl font-bold
                        ${logros.completed ? 'text-green-300' : 'text-white'}
                      `}>
                        {logros.title}
                      </h2>
                      <p className="text-gray-400">{logros.description}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                    <div 
                      className={`
                        h-2.5 rounded-full
                        ${logros.completed ? 'bg-green-600' : 'bg-pink-600'}
                      `}
                      style={{
                        width: `${logros.progress}%`
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Pasos para completar</span>
                    <span>
                      {logros.stepsProgress}/{logros.stepsFinal}
                    </span>
                  </div>

                  <div>
                    <hr className="mt-3 mb-3"/>
                    
                    <span className="text-sm text-gray-400">Premios</span>

                  {/* Contenedor para los premios */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                      {logros.premios.map((premio) => (
                        <div 
                          key={premio.id} 
                          className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg"
                        >
                          {/* Imagen del premio */}
                          <Image 
                            src={premio.imagen} 
                            alt={premio.titulo} 
                            width={40} 
                            height={40} 
                            className="object-cover rounded-full" 
                          />
                          
                          {/* Información del premio */}
                          <div>
                            <h4 className="text-sm text-white font-semibold">{premio.titulo}</h4>
                            <p className="text-xs text-gray-400">{premio.subtitulo}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                      

                  <div className="flex justify-between mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteLogroId(logros.id)}
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
        )}
      </div>

      <AnimatePresence>
        {deleteLogroId && (
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
                <h2 className="text-3xl font-bold text-white">Confirmar eliminación</h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg">¿Estás seguro de que quieres eliminar este logro?</p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteLogroId(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full shadow-md transition-colors duration-300 text-lg"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteLogroId && handleDelete(deleteLogroId)}
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

      <LogrosForm 
        isOpen={isLogrosFormOpen} 
        onClose={() => setIsLogrosFormOpen(false)} 
        onLogroAdded={fetchLogros}
      />
    </div>
  );
}