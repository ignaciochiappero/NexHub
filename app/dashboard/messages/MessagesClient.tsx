
//app\dashboard\messages\MessagesClient.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, ArrowLeft } from 'lucide-react';
import { ConversationList } from './components/ConversationList';
import { UserList } from './components/UserList';
import { ChatMessages } from './components/ChatMessages';
import { Conversation, User, Message } from '@/types/chat';

interface MessagesClientProps {
  session: any;
  initialConversations: Conversation[];
  initialUsers: User[];
}

export default function MessagesClient({ session, initialConversations, initialUsers }: MessagesClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const conversationListRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (conversationId: number) => {
    const res = await fetch(`/api/conversations/${conversationId}`);
    const data = await res.json();
    setMessages(data);
  };

  const handleSelectConversation = (id: number) => {
    const conversation = conversations.find(c => c.id === id);
    setSelectedConversation(conversation || null);
    if (conversation) {
      fetchMessages(conversation.id);
    }
    setShowUserList(false);
  };

  const handleStartConversation = async (userId: number) => {
    const existingConversation = conversations.find(conv => 
      conv.participants.some(p => p.user.id === userId)
    );

    if (existingConversation) {
      handleSelectConversation(existingConversation.id);
    } else {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds: [userId] }),
      });
      const newConversation = await res.json();
      setConversations([...conversations, newConversation]);
      setSelectedConversation(newConversation);
      setShowUserList(false);
      fetchMessages(newConversation.id);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const res = await fetch(`/api/conversations/${selectedConversation.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage }),
    });
    const sentMessage = await res.json();
    setMessages([...messages, sentMessage]);
    setNewMessage('');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (conversationListRef.current && conversationListRef.current.contains(event.target as Node)) {
      setSelectedConversation(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBackToChats = () => {
    setShowUserList(false);
  };

  const slideVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  };

  return (
    <div className="flex h-screen w-full mx-auto text-white px-20">
      <div className="flex w-full h-full max-h-[calc(100vh-80px)] overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: selectedConversation ? "30%" : "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-full overflow-hidden rounded-2xl bg-[#242424] shadow-2xl"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-blender-mayus text-3xl text-white">
                Mensajes
              </h1>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setShowUserList(true)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-pink-500/25"
              >
                <Plus size={24} />
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {showUserList ? (
                <motion.div
                  key="userList"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex-grow overflow-y-auto custom-scrollbar"
                >
                  <UserList 
                    users={users}
                    conversations={conversations}
                    onStartConversation={handleStartConversation}
                    onSelectExistingConversation={handleSelectConversation}
                    onBackToChats={handleBackToChats}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="conversationList"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex-grow overflow-y-auto custom-scrollbar"
                  ref={conversationListRef}
                >
                  <ConversationList
                    conversations={conversations}
                    selectedId={selectedConversation?.id || null}
                    onSelect={handleSelectConversation}
                    onNewChat={() => setShowUserList(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {selectedConversation && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "70%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full ml-6 bg-[#242424] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700/50 flex items-center backdrop-blur-sm bg-black/10">
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedConversation(null)}
                  className="mr-4 md:hidden text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={24} />
                </motion.button>
                <h2 className="font-blender-medium text-xl text-gray-100">
                  {selectedConversation.participants
                    .map(p => p.user.name)
                    .filter(name => name !== session?.user?.name)
                    .join(', ')}
                </h2>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                <ChatMessages messages={messages} currentUserEmail={session?.user?.email || ''} />
              </div>

              <div className="p-6 border-t border-gray-700/50 backdrop-blur-sm bg-black/10">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-grow bg-[#353535] text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-geist-sans"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <Send size={24} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a5a5a;
        }
      `}</style>
    </div>
  );
}

