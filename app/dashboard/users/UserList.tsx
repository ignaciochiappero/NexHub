//app\(pages)\users\UserList.tsx



/* eslint-disable @typescript-eslint/no-unused-vars */



'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Search, UserPlus, MapPin, Briefcase, Cake, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type UserAchievement = {
  id: number;
  completed: boolean;
};

type User = {
  id: number;
  name: string;
  image: string | null;
  role: string;
  email: string;
  projectCount: number;
  isOnline: boolean;
  location: string | null;
  company: string | null;
  birthday: string;
  achievements: UserAchievement[];
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateUserStatus = async () => {
      await fetch('/api/users/online', { method: 'POST' });
    };

    const interval = setInterval(updateUserStatus, 60000); // Actualizar cada minuto
    updateUserStatus(); // Actualizar inmediatamente al montar el componente

    return () => clearInterval(interval);
  }, []);


  //Función para buscar usuarios
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    
  );


  //mostrar fecha zona horaria arg
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const argDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
      return argDate.toISOString().split('T')[0];
    } catch (error) {
      return dateString;
    }
  };

  const displayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const argDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
      return argDate.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };
  
  const handleSendMessage = async (userId: number) => {
    setIsLoading(true);
    try {
      // First, check if a conversation already exists
      const checkResponse = await fetch(`/api/conversations/check/${userId}`);
      const existingConversation = await checkResponse.json();

      let conversationId;

      if (existingConversation) {
        // If a conversation exists, use its ID
        conversationId = existingConversation.id;
      } else {
        // If no conversation exists, create a new one
        const createResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participantIds: [userId] }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create conversation');
        }

        const newConversation = await createResponse.json();
        conversationId = newConversation.id;
      }

      // Navigate to the messages page with the conversation ID
      router.push(`/dashboard/messages?conversationId=${conversationId}`);
    } catch (error) {
      console.error('Error handling conversation:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-8 pt-40 font-[family-name:var(--blender-medium)]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}     
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 mb-12 flex items-center"
        >
          <Users className="mr-4 text-pink-500" size={48} /> 
          Usuarios
        </motion.h1>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }} 
          className="mb-8 relative"
        >
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar usuarios por nombre"
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

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }} 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredUsers.map((user) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-6 
                       transition-all duration-300 shadow-lg hover:shadow-xl
                       border border-gray-800 hover:border-pink-500/30"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center mb-4">
                <div className="relative">
                  <Image 
                    src={user.image || '/user.png'}
                    alt={user.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4 border-2 border-pink-500/30"
                    style={{ boxShadow: "0 0 20px rgba(236,72,153,0.3)" }}
                  />
                  <div 
                    className={`
                      absolute bottom-0 right-4 w-3 h-3 rounded-full 
                      ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}
                      shadow-lg
                    `}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 
                                 text-pink-400 text-sm inline-block mt-1">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="bg-[#212121]/50 backdrop-blur-sm rounded-xl p-4 mb-4 
                            border border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Logros Completados</span>
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    {user.achievements.filter(a => a.completed).length}
                  </span>
                </div>
              </div>

              <div className="text-gray-400 text-sm space-y-2">
                <p className="flex items-center">
                  <MapPin size={16} className="mr-2 text-pink-500" />
                  {user.location || 'No especificada'}
                </p>
                <p className="flex items-center">
                  <Briefcase size={16} className="mr-2 text-pink-500" />
                  {user.company || 'No especificada'}
                </p>
                <p className="flex items-center">
                  <Cake size={16} className="mr-2 text-pink-500" />
                  {displayDate(formatDate(user.birthday))}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>       
        {selectedUser && (
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
              className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full 
                       border border-gray-800 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                  {selectedUser.name}
                </h2>
                <motion.button 
                  whileHover={{ scale: 1.1, color: '#EC4899' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              <div className="flex items-center mb-6">
                <Image 
                  src={selectedUser.image || '/user.png'}
                  alt={selectedUser.name}
                  width={100}
                  height={100}
                  className="rounded-full mr-4 border-2 border-pink-500/30"
                  style={{ boxShadow: "0 0 30px rgba(236,72,153,0.3)" }}
                />
                <div>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 
                                 text-pink-400 text-sm inline-block mb-2">
                    {selectedUser.role}
                  </span>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="bg-[#212121]/50 backdrop-blur-sm rounded-xl p-6 mb-6 
                            border border-gray-800 space-y-3">
                <p className="text-gray-300">
                  Logros Completados: {' '}
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    {selectedUser.achievements.filter(a => a.completed).length}
                  </span>
                </p>
                <p className="text-gray-300 flex items-center">
                  <MapPin size={16} className="mr-2 text-pink-500" />
                  {selectedUser.location || 'No especificada'}
                </p>
                <p className="text-gray-300 flex items-center">
                  <Briefcase size={16} className="mr-2 text-pink-500" />
                  {selectedUser.company || 'No especificada'}
                </p>
                <p className="text-gray-300 flex items-center">
                  <Cake size={16} className="mr-2 text-pink-500" />
                  {displayDate(formatDate(selectedUser.birthday))}
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSendMessage(selectedUser.id)}
                className="w-full py-3 px-6 bg-gradient-to-r from-pink-600 to-purple-600 
                         hover:from-pink-700 hover:to-purple-700 text-white rounded-xl 
                         shadow-lg hover:shadow-pink-500/25 transition-all 
                         flex items-center justify-center text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-t-2 border-white rounded-full"
                  />
                ) : (
                  <>
                    <MessageSquare className="mr-2" size={20} />
                    Enviar Mensaje
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}