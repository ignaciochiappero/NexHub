/* eslint-disable @typescript-eslint/no-explicit-any */
//app\dashboard\blog\components\PostCard.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Edit, Trash } from "lucide-react"
import CommentSection from "./CommentSection"

const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) {
    // Si han pasado más de 24 horas, mostrar la fecha
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    }).format(date)
  } else if (diffInHours > 0) {
    // Si han pasado horas
    return `Publicado hace ${diffInHours === 1 ? 'una hora' : `${diffInHours} horas`}`
  } else if (diffInMinutes > 0) {
    // Si han pasado minutos
    return `Publicado hace ${diffInMinutes === 1 ? 'un minuto' : `${diffInMinutes} minutos`}`
  } else {
    // Si ha pasado menos de un minuto
    return "Publicado hace un momento"
  }
}

interface PostCardProps {
  post: any
  currentUser: any
  onPostUpdate: (updatedPost: any) => void
  onPostDelete: (deletedPostId: number) => void
}

export default function PostCard({ post, currentUser, onPostUpdate, onPostDelete }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(false)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
        setLikesCount(data.likes)
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleEdit = async () => {
    try {
      const formData = new FormData()
      formData.append("content", editedContent)
      if (imageToDelete) {
        formData.append("deleteImage", "true")
      }

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        const updatedPost = await response.json()
        onPostUpdate(updatedPost)
        setIsEditing(false)
        setImageToDelete(false)
      }
    } catch (error) {
      console.error("Error updating post:", error)
    }
  }

  const handleDelete = async () => {
    const message = post.systemPost 
      ? "¿Estás seguro de que quieres eliminar este post del sistema?"
      : "¿Estás seguro de que quieres eliminar este post?"
    
    if (window.confirm(message)) {
      try {
        const response = await fetch(`/api/posts/${post.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          onPostDelete(post.id)
        }
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  const canDeletePost = currentUser.id === post.userId || (currentUser.isAdmin && post.systemPost)
  const canEditPost = !post.systemPost && currentUser.id === post.userId

  return (
    <div className="bg-[#242424] rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
        {post.systemPost ? (
            // Avatar y nombre para posts del sistema
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center mr-3">
                <span className="text-white text-lg">N</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">{post.systemAuthor || "Nex-Hub"}</h3>
                <p className="text-sm text-gray-400">
                  {formatRelativeTime(new Date(post.createdAt))}
                </p>
              </div>
            </div>
          ) : (
            // Avatar y nombre para posts normales
            <>
              <Image
                src={post.user.image || "/user.png"}
                alt={post.user.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold text-white">{post.user.name}</h3>
                <p className="text-sm text-gray-400">
                  {formatRelativeTime(new Date(post.createdAt))}
                </p>
              </div>
            </>
          )}
        </div>
        
        {/* Mostrar botones de edición/eliminación según los permisos */}
        {(canEditPost || canDeletePost) && (
          <div className="flex space-x-2">
            {canEditPost && (
              <button onClick={() => setIsEditing(!isEditing)} className="text-gray-400 hover:text-white">
                <Edit size={18} />
              </button>
            )}
            {canDeletePost && (
              <button 
                onClick={handleDelete} 
                className={`text-gray-400 hover:text-white ${post.systemPost ? 'text-red-400 hover:text-red-500' : ''}`}
              >
                <Trash size={18} />
              </button>
            )}
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
          {post.image && !imageToDelete && (
            <div className="mt-2">
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Imagen del post"
                width={200}
                height={150}
                className="rounded-lg object-cover"
              />
              <button
                onClick={() => setImageToDelete(true)}
                className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar imagen
              </button>
            </div>
          )}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                setIsEditing(false)
                setImageToDelete(false)
              }}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white mr-2"
            >
              Cancelar
            </button>
            <button onClick={handleEdit} className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700">
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-white mb-4">{post.content}</p>
          {post.image && (
            <div className="mb-4">
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Imagen del post"
                width={500}
                height={300}
                className="rounded-lg object-cover w-full"
              />
            </div>
          )}
        </>
      )}
      <div className="flex items-center space-x-4 text-gray-400">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${isLiked ? "text-pink-500" : "hover:text-pink-500"}`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
          className={`flex items-center space-x-1 hover:text-white ${isCommentsExpanded ? "text-white" : ""}`}
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
  )
}