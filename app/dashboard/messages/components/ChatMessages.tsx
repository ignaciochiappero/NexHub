//app\dashboard\messages\components\ChatMessages.tsx


"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Trash } from "lucide-react"
import Image from "next/image"
import type { Message } from "@/types/chat"

interface ChatMessagesProps {
  messages: Message[]
  currentUserEmail: string
  onEditMessage: (message: Message) => void
  onSelectMessage: (messageId: number) => void
  selectedMessages: number[]
}

const formatMessageDate = (date: Date) => {
  const messageDate = new Date(date)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return "Justo ahora"
  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`
  }
  if (diffHours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  if (diffDays === 1) {
    return `Ayer ${messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  }
  return messageDate.toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const messageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

export function ChatMessages({
  messages,
  currentUserEmail,
  onEditMessage,
  onSelectMessage,
  selectedMessages,
}: ChatMessagesProps) {
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const isCurrentUserMessage = useCallback(
    (message: Message) => message.sender?.email === currentUserEmail,
    [currentUserEmail],
  )

  const handleEditClick = useCallback((message: Message, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingMessageId(message.id)
    setEditContent(message.content)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingMessageId(null)
    setEditContent("")
    setHoveredMessageId(null)
  }, [])

  const handleEditSubmit = useCallback(
    async (message: Message) => {
      try {
        if (!editContent.trim()) {
          return handleCancelEdit()
        }

        const response = await fetch(`/api/messages/${message.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editContent.trim(),
          }),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar el mensaje")
        }

        const updatedMessage = await response.json()
        onEditMessage(updatedMessage)
        handleCancelEdit()
      } catch (error) {
        console.error("Error al editar el mensaje:", error)
        handleCancelEdit()
      }
    },
    [editContent, handleCancelEdit, onEditMessage],
  )

  const handleDeleteClick = useCallback(async (messageId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setShowDeleteConfirm(null)

      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      })

      if (!response.ok && response.status !== 404) {
        throw new Error("Error al eliminar el mensaje")
      }

      setHoveredMessageId(null)
    } catch (error) {
      console.error("Error al eliminar mensaje:", error)
    }
  }, [])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, message: Message) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleEditSubmit(message)
      } else if (e.key === "Escape") {
        handleCancelEdit()
      }
    },
    [handleEditSubmit, handleCancelEdit],
  )

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={messageVariants}
            className={`flex ${isCurrentUserMessage(message) ? "justify-end" : "justify-start"}`}
            onMouseEnter={() => !editingMessageId && setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <div
              className={`
                max-w-[70%] rounded-lg p-4 relative group
                ${isCurrentUserMessage(message) ? "bg-gradient-to-r from-pink-600 to-purple-600" : "bg-[#353535]"}
                ${selectedMessages.includes(message.id) ? "ring-2 ring-blue-500 ring-opacity-75" : ""}
                ${isCurrentUserMessage(message) ? "text-white" : "text-gray-100"}
                transition-all duration-200 ease-in-out
                hover:shadow-lg
                ${isCurrentUserMessage(message) ? "hover:shadow-pink-500/20" : "hover:shadow-gray-500/20"}
              `}
              onClick={() => !editingMessageId && onSelectMessage(message.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="relative w-8 h-8">
                  <Image
                    src={message.sender?.image || "/user.png"}
                    alt={message.sender?.name || "Usuario"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{message.sender?.name || "Usuario"}</span>
                  <span className="text-xs opacity-75">{formatMessageDate(message.createdAt)}</span>
                </div>
              </div>

              {editingMessageId === message.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, message)}
                    className="w-full bg-black/20 rounded p-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-1 rounded bg-gray-600 hover:bg-gray-700 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleEditSubmit(message)}
                      className="px-2 py-1 rounded bg-pink-600 hover:bg-pink-700 transition-colors text-sm"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-base break-words whitespace-pre-wrap">{message.content}</p>
              )}

              {isCurrentUserMessage(message) && hoveredMessageId === message.id && !editingMessageId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-2 right-2 flex items-center gap-2 bg-black/20 rounded-md p-1"
                >
                  <button
                    onClick={(e) => handleEditClick(message, e)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Editar mensaje"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm(message.id)
                    }}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Eliminar mensaje"
                  >
                    <Trash size={16} />
                  </button>
                </motion.div>
              )}

              {showDeleteConfirm === message.id && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-[#353535] p-6 rounded-xl max-w-sm w-full mx-4"
                  >
                    <h3 className="text-lg font-semibold mb-4">¿Estás seguro de eliminar este mensaje?</h3>
                    <p className="text-gray-300 mb-6">Esta acción no se puede deshacer.</p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(message.id, e)}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

