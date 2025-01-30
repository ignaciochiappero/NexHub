

"use client";

import type { Conversation } from "@/types/chat";
import { MessageCircle, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onNewChat: () => void;
  currentUserEmail: string;
}

const getOtherUser = (conversation: Conversation, currentUserEmail: string) => {
  const otherUser = conversation.participants.find(
    (p) => p.user.email !== currentUserEmail
  )?.user;
  return {
    name: otherUser?.name || "Usuario desconocido",
    image: otherUser?.image || "/user.png",
  };
};

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onDelete,
  onNewChat,
  currentUserEmail,
}: ConversationListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (conversations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8 px-4 h-full flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        </motion.div>
        <p className="font-blender-normal text-gray-400 mb-4">
          No hay conversaciones aún
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewChat}
          className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-6 py-3 rounded-xl
                     text-pink-400 font-blender-medium hover:text-pink-300
                     transition-colors duration-300 hover:shadow-lg hover:shadow-pink-500/10"
        >
          Iniciar una nueva conversación
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar"
      >
        <AnimatePresence>
          {conversations.map((conversation) => {
            const { name, image } = getOtherUser(
              conversation,
              currentUserEmail
            );
            return (
              <motion.div
                key={conversation.id}
                variants={itemVariants}
                className={`w-full p-3 rounded-xl flex items-center space-x-3
                           transition-all duration-300 group cursor-pointer
                           ${
                             selectedId === conversation.id
                               ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 shadow-lg shadow-pink-500/5"
                               : "hover:bg-[#2A2A2A] hover:shadow-md"
                           }`}
                onClick={() => onSelect(conversation.id)}
              >
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex justify-between flex-1 min-w-0 ">
                  
                  <div className="flex flex-col ">

                    <div className="flex items-center justify-between ">
                      <p
                        className={`font-blender-medium truncate transition-colors duration-300
                        ${
                          selectedId === conversation.id
                            ? "text-pink-300"
                            : "text-gray-200 group-hover:text-pink-300"
                        }`}
                      >
                        {name}
                      </p>
                    </div>

                    {conversation.messages?.[0] && (
                      <p className="text-sm text-gray-400 truncate mt-1 font-geist-sans">
                        {conversation.messages[0].content}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conversation.id);
                    }}
                    className="text-gray-400 hover:text-pink-500 transition-colors p-1 opacity-0 group-hover:opacity-100 "
                  >
                    <Trash size={16} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
