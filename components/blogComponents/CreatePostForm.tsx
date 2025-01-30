"use client"

import { useState, useRef } from "react"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CreatePostFormProps {
  currentUser: any
  onPostCreated: (newPost: any) => void
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!content.trim() && !image) || isSubmitting) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("content", content)
      if (image) {
        formData.append("file", image)
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newPost = await response.json()
        onPostCreated(newPost)
        setContent("")
        setImage(null)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="¿Qué estás pensando?"
        className="w-full p-4 bg-[#242424] text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
        rows={4}
      />
      <div className="mt-2 flex items-center">
        <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mr-2 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
        >
          <ImageIcon className="inline-block mr-2" size={20} />
          {image ? "Cambiar imagen" : "Agregar imagen"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (!content.trim() && !image)}
          className={`px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
      {previewUrl && (
        <div className="mt-2">
          <Image
            src={previewUrl || "/placeholder.svg"}
            alt="Vista previa"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </form>
  )
}

