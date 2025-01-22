//app\(pages)\admin\users\page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  Trash2,
  Edit2,
  AlertCircle,
  Users,
  ChevronLeft,
} from "lucide-react";
import SignupModal from "@/components/authComponents/SignupForm";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  birthday: string;
  image: string | null;    // Agregar estas propiedades
  company: string | null;  // Agregar estas propiedades
  location: string | null; // Agregar estas propiedades
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
      
      // Asegurarnos de que todos los campos existan, incluso si son null
      const formattedData = data.map((user: User) => ({
        ...user,
        image: user.image || null,
        company: user.company || null,
        location: user.location || null,
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : null,
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
    <div className="min-h-screen bg-[#242424] p-8 pt-28 font-[family-name:var(--blender-medium)]">
      <Link href="/admin">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white py-3 rounded-full transition-all flex items-center text-lg"
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
            <Users className="mr-4" size={48} />
            Administrar Usuarios
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddUser}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/25 transition-all flex items-center text-lg"
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
            className="w-full px-6 py-4 pl-14 rounded-full shadow-lg border border-gray-700 bg-[#181818] text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
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
                className="bg-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
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
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[#181818] hover:bg-[#1e1e1e] rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {user.name}
                    </h3>
                    <p className="text-gray-400 text-lg">{user.email}</p>
                    <p className="text-gray-400 text-lg">{user.role}</p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteUserId(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center"
                    >
                      <Trash2 className="mr-2" size={18} />
                      Eliminar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(user)}
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
        {deleteUserId && (
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
                ¿Estás seguro de que quieres eliminar este usuario?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteUserId(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full shadow-md transition-colors duration-300 text-lg"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteUserId && handleDelete(deleteUserId)}
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
