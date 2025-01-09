//app\dashboard\blog\components\CreatePostForm.tsx
"use client";

import { useState } from "react";

interface CreatePostFormProps {
  currentUser: any;
  onPostCreated: (newPost: any) => void;
}

export default function CreatePostForm({ currentUser, onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const newPost = await response.json();
        // Formatear el nuevo post de la misma manera que los posts iniciales
        const formattedPost = {
          ...newPost,
          user: currentUser,
          isLiked: false,
          likesCount: 0,
          comments: [],
        };
        onPostCreated(formattedPost);
        setContent("");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="¿Qué estás pensando?"
        className="w-full p-4 bg-[#242424] text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
        rows={4}
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className={`mt-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  );
}