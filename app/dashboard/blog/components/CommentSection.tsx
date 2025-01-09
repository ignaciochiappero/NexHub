// app\dashboard\blog\components\CommentSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Edit, Trash, Smile } from 'lucide-react';
import { dateFormatter } from "@/utils/dateFormatter";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface CommentSectionProps {
  postId: number;
  initialComments: any[];
  currentUser: any;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CommentSection({ 
  postId, 
  initialComments, 
  currentUser, 
  isExpanded,
  onToggle 
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments([addedComment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, isLiked: data.isLiked, likesCount: data.likes }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleEditComment = async (commentId: number) => {
    if (!editedContent.trim()) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(
          comments.map((comment) =>
            comment.id === commentId ? { ...comment, content: editedContent } : comment
          )
        );
        setEditingCommentId(null);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setComments(comments.filter((comment) => comment.id !== commentId));
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleEmojiSelect = (emoji: any, commentId: number | null = null) => {
    if (commentId) {
      setEditedContent(editedContent + emoji.native);
    } else {
      setNewComment(newComment + emoji.native);
    }
    setShowEmojiPicker(null);
  };

  if (!isExpanded) return null;

  return (
    <div className="mt-6">
      <form onSubmit={handleAddComment} className="mb-4 relative">
        <div className="flex items-center bg-[#333] rounded">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Añade un comentario..."
            className="flex-1 p-2 bg-transparent text-white rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(0)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Smile size={20} />
          </button>
        </div>
        {showEmojiPicker === 0 && (
          <div className="absolute right-0 z-50 mt-2">
            <Picker 
              data={data} 
              onEmojiSelect={(emoji: any) => handleEmojiSelect(emoji)}
              theme="dark"
            />
          </div>
        )}
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          Comentar
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#333] rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Image
                  src={comment.user.image || "/placeholder-avatar.png"}
                  alt={comment.user.name}
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
                <div>
                  <h4 className="font-semibold text-white">{comment.user.name}</h4>
                  <p className="text-xs text-gray-400">
                    {dateFormatter.format(new Date(comment.createdAt))}
                  </p>
                </div>
              </div>
              {currentUser.id === comment.userId && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(comment)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )}
            </div>
            {editingCommentId === comment.id ? (
              <div className="relative">
                <div className="flex items-center bg-[#242424] rounded">
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 p-2 bg-transparent text-white rounded focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(comment.id)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Smile size={20} />
                  </button>
                </div>
                {showEmojiPicker === comment.id && (
                  <div className="absolute right-0 z-50 mt-2">
                    <Picker 
                      data={data} 
                      onEmojiSelect={(emoji: any) => handleEmojiSelect(emoji, comment.id)}
                      theme="dark"
                    />
                  </div>
                )}
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white mb-2">{comment.content}</p>
            )}
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`flex items-center space-x-1 ${
                comment.isLiked ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
              }`}
            >
              <Heart size={16} fill={comment.isLiked ? "currentColor" : "none"} />
              <span>{comment.likesCount}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}