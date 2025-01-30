"use client";
import { Heart } from 'lucide-react';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
  initialIsLiked: boolean;
}

export default function LikeButton({ postId, initialLikes, initialIsLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/posts/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Error al procesar like");

      const data = await response.json();
      setLikes(data.likes);
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button 
      className={`flex items-center space-x-1 ${isLoading ? 'opacity-50' : ''} ${isLiked ? 'text-pink-500' : 'text-gray-300'}`}
      onClick={handleLike}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isLiked ? "liked" : "notLiked"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {likes > 0 && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {likes}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

