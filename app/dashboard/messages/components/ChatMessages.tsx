//app\dashboard\messages\components\ChatMessages.tsx
"use client";

import { Message } from '@/types/chat';
import { motion } from 'framer-motion';

interface ChatMessagesProps {
  messages: Message[];
  currentUserEmail: string;
}

export function ChatMessages({ messages, currentUserEmail }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex ${
            message.sender?.email === currentUserEmail
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender?.email === currentUserEmail
                ? 'bg-pink-600 text-white'
                : 'bg-[#353535] text-white'
            }`}
          >
            <p className="text-sm font-medium mb-1">
              {message.sender?.name || 'Unknown User'}
            </p>
            <p>{message.content}</p>
            <p className="text-xs mt-1 opacity-70">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
