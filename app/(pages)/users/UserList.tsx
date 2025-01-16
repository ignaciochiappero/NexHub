//app\(pages)\users\UserList.tsx

//TODO: NO MOSTRAR EL ROL, MOSTRAR EL CARGO


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
  
  //redireccion para mensajes
  const handleSendMessage = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds: [userId] }),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const conversation = await response.json();
      router.push(`/dashboard/messages?conversationId=${conversation.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
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
    className="bg-[#1A1A1A] min-h-screen p-6 pt-40 font-[family-name:var(--blender-medium)]">

      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}     
          className="text-4xl text-white mb-8 flex items-center">
          <Users className="mr-4 text-pink-500" /> Usuarios
        </motion.h1>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }} 
          className="mb-6 flex space-x-4">
          
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios por nombre"
              className="w-full bg-[#353535] text-white pl-10 p-3 rounded-xl"
            />
          </div>

        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <motion.div 
              key={user.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-[#353535] rounded-2xl p-6 hover:bg-[#454545] transition cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center mb-4">
                <div className="relative">
                  <Image 
                    src={user.image || '/user.png'}
                    alt={user.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div 
                    className={`
                      absolute bottom-0 right-4 w-3 h-3 rounded-full 
                      ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}
                    `}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.role}</p>
                </div>
              </div>

              <div className="bg-[#454545] rounded-xl p-3 mb-4">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Logros Completados</span>
                  <span className="font-bold text-pink-500">{user.achievements.filter(a => a.completed).length}</span>
                </div>
              </div>

              <div className="text-gray-400 text-sm">
                <p className="flex items-center mb-1">
                  <MapPin size={16} className="mr-2" />
                  {user.location || 'No especificada'}
                </p>
                <p className="flex items-center mb-1">
                  <Briefcase size={16} className="mr-2" />
                  {user.company || 'No especificada'}
                </p>
                <p className="flex items-center">
                  <Cake size={16} className="mr-2" />
                  {displayDate(formatDate(user.birthday))}
                </p>
              </div>
            </motion.div >
          ))}
        </motion.div>
      </div>

      <AnimatePresence>       
      {selectedUser && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }} 
              className="bg-[#353535] p-6 rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
              <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
              </motion.button>
            </div>
            <div className="flex items-center mb-4">
              <Image 
                src={selectedUser.image || '/user.png'}
                alt={selectedUser.name}
                width={100}
                height={100}
                className="rounded-full mr-4"
              />
              <div>
                <p className="text-gray-400">{selectedUser.role}</p>
                <p className="text-gray-400">{selectedUser.email}</p>
              </div>
            </div>
            <div className="bg-[#454545] rounded-xl p-4 mb-4">
              <p className="text-white mb-2">Logros Completados: <span className="font-bold text-pink-500">{selectedUser.achievements.filter(a => a.completed).length}</span></p>
              <p className="text-white mb-2">Ubicación: {selectedUser.location || 'No especificada'}</p>
              <p className="text-white mb-2">Empresa: {selectedUser.company || 'No especificada'}</p>
              <p className="text-white">Cumpleaños: {displayDate(formatDate(selectedUser.birthday))}</p>
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(selectedUser.id)}
                className="bg-pink-600 text-white p-2 rounded-xl w-full hover:bg-pink-700 transition flex items-center justify-center"
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
                    <MessageSquare className="mr-2" />
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

