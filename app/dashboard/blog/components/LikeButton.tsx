"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

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
    <button 
      className={`flex items-center hover:text-pink-500 ${isLoading ? 'opacity-50' : ''} ${isLiked ? 'text-pink-500' : ''}`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className="mr-2" fill={isLiked ? "currentColor" : "none"} />
      {likes}
    </button>
  );
}