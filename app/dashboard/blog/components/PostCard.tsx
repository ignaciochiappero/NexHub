"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Edit, Trash } from 'lucide-react';
import CommentSection from "./CommentSection";

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

interface PostCardProps {
  post: any;
  currentUser: any;
  onPostUpdate: (updatedPost: any) => void;
  onPostDelete: (deletedPostId: number) => void;
}

export default function PostCard({ post, currentUser, onPostUpdate, onPostDelete }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likes);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdate(updatedPost);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este post?")) {
      try {
        const response = await fetch(`/api/posts/${post.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          onPostDelete(post.id);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="bg-[#242424] rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image
            src={post.user.image || "/placeholder-avatar.png"}
            alt={post.user.name}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-white">{post.user.name}</h3>
            <p className="text-sm text-gray-400">
              {dateFormatter.format(new Date(post.createdAt))}
            </p>
          </div>
        </div>
        {currentUser.id === post.userId && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-white"
            >
              <Edit size={18} />
            </button>
            <button onClick={handleDelete} className="text-gray-400 hover:text-white">
              <Trash size={18} />
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 bg-[#333] text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white mb-4">{post.content}</p>
      )}
      <div className="flex items-center space-x-4 text-gray-400">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-pink-500" : "hover:text-pink-500"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>{likesCount}</span>
        </button>
        <button 
          onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
          className={`flex items-center space-x-1 hover:text-white ${
            isCommentsExpanded ? 'text-white' : ''
          }`}
        >
          <MessageCircle size={18} />
          <span>{post.comments.length}</span>
        </button>
      </div>
      <CommentSection 
        postId={post.id} 
        initialComments={post.comments} 
        currentUser={currentUser}
        isExpanded={isCommentsExpanded}
        onToggle={() => setIsCommentsExpanded(!isCommentsExpanded)}
      />
    </div>
  );
}