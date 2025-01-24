//app\(pages)\admin\logros\panelLogros\page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  Zap,
  Heart,
  Crown,
  Diamond,
  Brain,
  Flame,
  Award,
  Sparkles,
  Gem,
  Sword,
  Book,
  Compass,
  Map,
  Mountain,
  Sun,
  Moon,
  Lightbulb,
  Flag,
  Crosshair,
  Eye,
  Gift,
  ChevronLeft,
} from "lucide-react";
import LogrosForm from "@/components/logrosForm/LogrosForm";
import Link from "next/link";

// Mapeo de strings a componentes de íconos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMapping: { [key: string]: any } = {
  Gauge: Gauge,
  Trophy: Trophy,
  Star: Star,
  Lock: Lock,
  Unlock: Unlock,
  Medal: Medal,
  Rocket: Rocket,
  Target: Target,
  CheckCircle: CheckCircle,
  Code: Code,
  Globe: Globe,
  Database: Database,
  Shield: Shield,
  Swords: Swords,
  Zap: Zap,
  Heart: Heart,
  Crown: Crown,
  Diamond: Diamond,
  Brain: Brain,
  Flame: Flame,
  Award: Award,
  Sparkles: Sparkles,
  Gem: Gem,
  Sword: Sword,
  Book: Book,
  Compass: Compass,
  Map: Map,
  Mountain: Mountain,
  Sun: Sun,
  Moon: Moon,
  Lightbulb: Lightbulb,
  Flag: Flag,
  Crosshair: Crosshair,
  Eye: Eye,
  Gift: Gift,
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

export default function AdminLogroPage() {
  const [logros, setLogros] = useState<Logro[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [premio, setPremio] = useState<Premio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLogroId, setDeleteLogroId] = useState<number | null>(null);
  const [isLogrosFormOpen, setIsLogrosFormOpen] = useState(false);
  const [logroToEdit, setLogroToEdit] = useState<Logro | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchLogros = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/logros");
      if (!response.ok) throw new Error("Error al obtener Logros");
      const data = await response.json();
      setLogros(data);
    } catch (error) {
      console.error("Error al cargar logros:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPremios = async () => {
    try {
      const response = await fetch("/api/premios");
      if (!response.ok) throw new Error("Error al obtener premios");
      const data = await response.json();
      setPremio(data);
    } catch (error) {
      console.error("Error al cargar premios:", error);
    }
  };

  useEffect(() => {
    fetchLogros();
    fetchPremios();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/logros/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el logro");
      fetchLogros();
      setDeleteLogroId(null);
    } catch (error) {
      console.error("Error al eliminar logro:", error);
      alert("Hubo un problema al eliminar el logro");
    }
  };

  const handleEdit = (logro: Logro) => {
    setLogroToEdit(logro);
    setIsEditing(true);
    setIsLogrosFormOpen(true);
  };

  const handleModalClose = () => {
    setIsLogrosFormOpen(false);
    setLogroToEdit(null);
    setIsEditing(false);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMapping[iconName];
    return IconComponent ? <IconComponent size={48} /> : <Trophy size={48} />;
  };

  const filteredLogros = logros.filter(
    (logro) =>
      logro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logro.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  return (
    <div className="min-h-screen p-8 pt-24 font-[family-name:var(--blender-medium)]">
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
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-r from-pink-500 to-purple-500 flex items-center">
            <Trophy className="mr-4 text-pink-500" size={48} />
            Administrar Logros
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLogroToEdit(null);
              setIsEditing(false);
              setIsLogrosFormOpen(true);
            }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 
                     hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg 
                     hover:shadow-pink-500/25 transition-all flex items-center text-lg"
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
            className="w-full px-6 py-4 pl-14 rounded-xl shadow-lg border border-gray-700 
                     bg-[#353535]/50 backdrop-blur-sm text-white 
                     focus:outline-none focus:ring-2 focus:ring-pink-500/20 
                     focus:border-pink-500 hover:border-pink-500/30 
                     transition-all text-lg"
          />
          <Search
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={24}
          />
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-[#404040] rounded-xl w-3/4 mb-4"></div>
                <div className="h-4 bg-[#404040] rounded-xl w-1/2"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredLogros.map((logro, index) => (
                <motion.div
                  key={logro.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`
                    p-6 rounded-xl transition-all duration-300 flex flex-col h-full
                    ${
                      logro.completed
                        ? "bg-[#353535]/50 backdrop-blur-sm border-2 border-teal-500/30"
                        : "bg-[#353535]/50 backdrop-blur-sm hover:bg-[#404040]/50"
                    }
                    border border-gray-800 hover:border-pink-500/30
                  `}
                  style={
                    logro.completed
                      ? { boxShadow: "0 0 30px rgba(20,184,166,0.3)" }
                      : undefined
                  }
                >
                  {/* Contenido principal */}
                  <div className="flex-grow">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                      <div
                        className={`
                          mr-4 w-12 h-12 flex items-center justify-center
                          ${logro.completed ? "text-teal-500" : "text-gray-400"}
                        `}
                      >
                        {getIconComponent(logro.icon)}
                      </div>
                      <div>
                        <h2 className={`
                          text-xl font-bold mb-1
                          ${logro.completed ? "text-teal-400" : "text-white"}
                        `}>
                          {logro.title}
                        </h2>
                        <p className="text-gray-400 text-sm">{logro.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          logro.completed
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                            : "bg-gradient-to-r from-pink-600 to-purple-600"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${logro.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Progress Counter */}
                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                      <span>Pasos para completar</span>
                      <span>{logro.stepsProgress}/{logro.stepsFinal}</span>
                    </div>

                    {/* Premios Section */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-400">
                        <Gift className="mr-2" size={16} />
                        Premios
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {logro.premios.map((premio) => (
                          <motion.div
                            key={premio.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#212121]/50 backdrop-blur-sm p-3 rounded-xl 
                                     border border-gray-800 hover:border-pink-500/30 
                                     transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10">
                                <Image
                                  src={premio.imagen}
                                  alt={premio.titulo}
                                  fill
                                  className="object-cover rounded-lg"
                                  style={{ boxShadow: "0 0 20px rgba(236,72,153,0.3)" }}
                                />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-white">
                                  {premio.titulo}
                                </h4>
                                <p className="text-xs text-gray-400">
                                  {premio.subtitulo}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-800">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteLogroId(logro.id)}
                      className="bg-[#404040] hover:bg-[#454545] text-white px-4 py-2 
                               rounded-xl shadow-md transition-colors duration-300 
                               flex items-center hover:text-red-500"
                    >
                      <Trash2 className="mr-2" size={18} />
                      Eliminar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(logro)}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 
                               hover:from-pink-700 hover:to-purple-700 text-white 
                               px-4 py-2 rounded-xl shadow-md transition-all 
                               duration-300 flex items-center"
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteLogroId && (
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
              className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-8 
                       max-w-sm w-full shadow-2xl border border-gray-800"
            >
              <div className="flex items-center mb-6">
                <AlertCircle className="text-pink-500 mr-4" size={32} />
                <h2 className="text-3xl font-bold text-white">
                  Confirmar eliminación
                </h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg">
                ¿Estás seguro de que quieres eliminar este logro?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteLogroId(null)}
                  className="bg-[#404040] hover:bg-[#454545] text-white px-6 py-3 
                           rounded-xl shadow-md transition-colors duration-300 text-lg"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteLogroId && handleDelete(deleteLogroId)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 
                           hover:from-pink-700 hover:to-purple-700 text-white 
                           px-6 py-3 rounded-xl shadow-md transition-all 
                           duration-300 flex items-center text-lg"
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
        onClose={handleModalClose}
        onLogroAdded={fetchLogros}
        logroToEdit={logroToEdit}
        isEditing={isEditing}
      />
    </div>
  );
}