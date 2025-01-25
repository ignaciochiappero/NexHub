"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Users, Search, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@/types/chat"

interface UserListProps {
  users: User[]
  onStartConversation: (userId: number) => void
  onBackToChats: () => void
  currentConversationParticipants?: number[]
}

export function UserList({
  users,
  onStartConversation,
  onBackToChats,
  currentConversationParticipants = [],
}: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [displayedUsers, setDisplayedUsers] = useState(users)

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !currentConversationParticipants.includes(user.id),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users, currentConversationParticipants])

  useEffect(() => {
    setDisplayedUsers(users.filter((user) => !currentConversationParticipants.includes(user.id)))
  }, [users, currentConversationParticipants])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const usersToDisplay = searchTerm ? filteredUsers : displayedUsers

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
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
            <h3 className="font-blender-medium text-lg text-white">Usuarios disponibles ({usersToDisplay.length})</h3>
          </div>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar usuarios..."
            className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border-none rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2 px-4 pb-4">
          <AnimatePresence>
            {usersToDisplay.length > 0 ? (
              usersToDisplay.map((user) => (
                <motion.button
                  key={user.id}
                  variants={itemVariants}
                  onClick={() => onStartConversation(user.id)}
                  className="w-full p-4 rounded-xl flex items-center space-x-4 
                           transition-all duration-300 group
                           hover:bg-gradient-to-r from-pink-500/10 to-purple-500/10 
                           hover:shadow-md hover:shadow-pink-500/5"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image src={user.image || "/user.png"} alt={user.name} fill className="rounded-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-blender-medium text-gray-200 group-hover:text-pink-300 transition-colors duration-300 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                  </div>
                </motion.button>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <p className="text-gray-400">
                  {searchTerm ? "No se encontraron usuarios con ese nombre" : "No hay usuarios disponibles"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

