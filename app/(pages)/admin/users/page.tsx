
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Trash2, Edit2, AlertCircle, Users, ChevronLeft } from 'lucide-react';
import SignupModal from "@/components/authComponents/SignupForm";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  birthday: string;
  position: string;
  image: string | null;
  company: string | null;
  location: string | null;
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();

      const formattedData = data.map((user: User) => ({
        ...user,
        image: user.image || null,
        company: user.company || null,
        location: user.location || null,
        birthday: user.birthday
          ? new Date(user.birthday).toISOString().split("T")[0]
          : null,
      }));

      setUsers(formattedData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el usuario");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setDeleteUserId(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Hubo un problema al eliminar el usuario");
    }
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsEditing(true);
    setIsSignupModalOpen(true);
  };

  const handleModalClose = () => {
    setIsSignupModalOpen(false);
    setUserToEdit(null);
    setIsEditing(false);
  };

  const handleAddUser = () => {
    setUserToEdit(null);
    setIsEditing(false);
    setIsSignupModalOpen(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 pt-24 sm:pt-24 font-[family-name:var(--blender-medium)]">
      <Link href="/admin">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white py-3 rounded-xl transition-all flex items-center text-lg hover:text-pink-500"
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
          <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 flex items-center mb-4 sm:mb-0">
            <Users className="mr-4 text-pink-500" size={48} />
            Administrar Usuarios
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddUser}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center text-lg"
          >
            <UserPlus className="mr-2" size={24} />
            Agregar usuario
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
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl shadow-lg border border-gray-700 
                     bg-[#353535]/50 backdrop-blur-sm text-white 
                     focus:outline-none focus:ring-2 focus:ring-pink-500/20 
                     focus:border-pink-500 hover:border-pink-500/30 
                     transition-all text-base sm:text-lg"
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
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 
                           transition-all duration-300 shadow-lg hover:shadow-xl
                           border border-gray-800 hover:border-pink-500/30"
                >
                  <div className="mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {user.name}
                    </h3>
                    <p className="text-gray-400 text-base sm:text-lg">{user.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 
                                   text-pink-400 text-sm inline-block"
                      >
                        {user.position}
                      </span>
                      {user.role === "ADMIN" && (
                        <span
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 to-purple-600/20 
                          text-cyan-400 text-sm inline-block"
                        >
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mt-4 sm:mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteUserId(user.id)}
                      className="bg-[#404040] hover:bg-[#454545] text-white px-4 py-2 
                               rounded-xl shadow-md transition-colors duration-300 
                               flex items-center justify-center hover:text-red-500"
                    >
                      <Trash2 className="mr-2" size={18} />
                      Eliminar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(user)}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 
                               hover:from-pink-700 hover:to-purple-700 text-white 
                               px-4 py-2 rounded-xl shadow-md transition-all 
                               duration-300 flex items-center justify-center"
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

      {deleteUserId && (
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
            className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <AlertCircle className="text-pink-500 mr-4" size={32} />
              <h2 className="text-3xl font-bold text-white">
                Confirmar eliminación
              </h2>
            </div>
            <p className="text-gray-300 mb-8 text-lg">
              ¿Estás seguro de que quieres eliminar este usuario?
            </p>
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeleteUserId(null)}
                className="bg-[#404040] hover:bg-[#454545] text-white px-6 py-3 
                         rounded-xl shadow-md transition-colors duration-300 text-lg"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteUserId && handleDelete(deleteUserId)}
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

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleModalClose}
        onUserAdded={fetchUsers}
        userToEdit={userToEdit}
        isEditing={isEditing}
      />
    </div>
  );
}
