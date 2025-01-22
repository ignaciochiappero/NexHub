//app\dashboard\messages\MessagesClient.tsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, ArrowLeft } from "lucide-react";
import { ConversationList } from "./components/ConversationList";
import { UserList } from "./components/UserList";
import { ChatMessages } from "./components/ChatMessages";
import type { Conversation, User, Message } from "@/types/chat";
import { useSearchParams } from "next/navigation";
import { pusherClient } from "@/libs/pusher";

interface MessagesClientProps {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  initialConversations: Conversation[];
  initialUsers: User[];
}

export default function MessagesClient({
  session,
  initialConversations,
  initialUsers,
}: MessagesClientProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [users] = useState<User[]>(initialUsers);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async (conversationId: number) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const handleSelectConversation = useCallback(
    (id: number) => {
      const conversation = conversations.find((c) => c.id === id);
      setSelectedConversation(conversation || null);
      if (conversation) {
        fetchMessages(conversation.id);
      }
      setShowUserList(false);
    },
    [conversations, fetchMessages]
  );

  useEffect(() => {
    const conversationId = searchParams.get("conversationId");
    if (conversationId) {
      const conversation = conversations.find(
        (c) => c.id === Number.parseInt(conversationId)
      );
      if (conversation) {
        handleSelectConversation(conversation.id);
      }
    }
  }, [searchParams, conversations, handleSelectConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const channel = pusherClient.subscribe(
        `conversation-${selectedConversation.id}`
      );

      channel.bind("new-message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      channel.bind("message-updated", (updatedMessage: Message) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === updatedMessage.id ? updatedMessage : message
          )
        );
      });

      channel.bind(
        "message-deleted",
        ({ messageId }: { messageId: number }) => {
          setMessages((prev) =>
            prev.filter((message) => message.id !== messageId)
          );
          setSelectedMessages((prev) => prev.filter((id) => id !== messageId));
        }
      );

      return () => {
        channel.unbind_all();
        pusherClient.unsubscribe(`conversation-${selectedConversation.id}`);
      };
    }
  }, [selectedConversation, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleStartConversation = useCallback(
    async (userId: number) => {
      const existingConversation = conversations.find((conv) =>
        conv.participants.some((p) => p.user.id === userId)
      );

      if (existingConversation) {
        handleSelectConversation(existingConversation.id);
        return;
      }

      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantIds: [userId] }),
        });
        const newConversation = await res.json();
        setConversations((prev) => [...prev, newConversation]);
        setSelectedConversation(newConversation);
        setShowUserList(false);
        fetchMessages(newConversation.id);
      } catch (error) {
        console.error("Error starting conversation:", error);
      }
    },
    [conversations, handleSelectConversation, fetchMessages]
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      await fetch(`/api/conversations/${selectedConversation.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    try {
      await fetch(`/api/conversations/${conversationId}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleEditMessage = async (updatedMessage: Message) => {
    try {
      const response = await fetch(`/api/messages/${updatedMessage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedMessage.content.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 404) {
        throw new Error("Error deleting message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleSelectMessage = useCallback((messageId: number) => {
    setSelectedMessages((prev) => {
      if (prev.includes(messageId)) {
        return prev.filter((id) => id !== messageId);
      }
      return [...prev, messageId];
    });
  }, []);

  const handleDeleteSelectedMessages = async () => {
    await Promise.all(selectedMessages.map(handleDeleteMessage));
    setSelectedMessages([]);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full mx-auto text-white px-4 md:px-20">
      <div className="md:w-1/3 h-full overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "100%" }}
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
                <UserList
                  users={users}
                  onStartConversation={handleStartConversation}
                  onBackToChats={() => setShowUserList(false)}
                  currentConversationParticipants={
                    selectedConversation?.participants?.map((p) => p.user.id) ||
                    []
                  }
                />
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedConversation?.id || null}
                  onSelect={handleSelectConversation}
                  onDelete={handleDeleteConversation}
                  onNewChat={() => setShowUserList(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedConversation && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:w-2/3 h-full ml-0 md:ml-6 bg-[#242424] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between backdrop-blur-sm bg-black/10">
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedConversation(null)}
                  className="mr-4 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={24} />
                </motion.button>
                <h2 className="font-blender-medium text-xl text-gray-100">
                  {selectedConversation.participants
                    .map((p) => p.user.name)
                    .filter((name) => name !== session?.user?.name)
                    .join(", ")}
                </h2>
              </div>
              {selectedMessages.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDeleteSelectedMessages}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
              <ChatMessages
                messages={messages}
                currentUserEmail={session?.user?.email || ""}
                onEditMessage={handleEditMessage}
                onSelectMessage={handleSelectMessage}
                selectedMessages={selectedMessages}
              />
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-gray-700/50 backdrop-blur-sm bg-black/10">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-4"
              >
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
  );
}
