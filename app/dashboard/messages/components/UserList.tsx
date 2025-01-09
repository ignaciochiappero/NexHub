//app\dashboard\messages\components\UserList.tsx
"use client";

import { useState, useEffect } from 'react';
import { User, Conversation } from '@/types/chat';
import { Users, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserListProps {
  users: User[];
  conversations: Conversation[];
  onStartConversation: (userId: number) => void;
  onSelectExistingConversation: (conversationId: number) => void;
  onBackToChats: () => void;
}

export function UserList({ 
  users, 
  conversations, 
  onStartConversation, 
  onSelectExistingConversation,
  onBackToChats
}: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleUserClick = (userId: number) => {
    const existingConversation = conversations.find(conv => 
      conv.participants.some(p => p.user.id === userId)
    );

    if (existingConversation) {
      onSelectExistingConversation(existingConversation.id);
    } else {
      onStartConversation(userId);
    }
  };

  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBackToChats}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <Users className="w-5 h-5 text-pink-500" />
          <h3 className="font-blender-medium text-lg text-white">Usuarios disponibles</h3>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border-none rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
        />
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-2 px-10"
      >
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.button
              key={user.id}
              variants={itemVariants}
              onClick={() => handleUserClick(user.id)}
              className="w-full p-4 rounded-xl flex items-center space-x-4 
                         transition-all duration-300 group
                         hover:bg-gradient-to-r from-pink-500/10 to-purple-500/10 
                         hover:shadow-md hover:shadow-pink-500/5"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 rounded-lg bg-[#2A2A2A] text-pink-500 group-hover:bg-pink-500/20 transition-colors duration-300">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-blender-medium text-gray-200 group-hover:text-pink-300 transition-colors duration-300">{user.name}</p>
                <p className="text-sm text-gray-400 font-geist-sans">{user.email}</p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
