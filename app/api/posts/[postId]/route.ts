
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/libs/prisma"
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth.config";
import cloudinary from "@/libs/cloudinary"


type RouteContext = {
  params: Promise<{ postId: string }>;
};

export async function PUT(    
  request: NextRequest,
    context: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { postId } = await context.params;

  const formData = await request.formData()
  const content = formData.get("content") as string
  const deleteImage = formData.get("deleteImage") as string

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  })

  if (!post || post.userId !== user.id) {
    return NextResponse.json({ error: "No autorizado para editar este post" }, { status: 403 })
  }

  let updatedImageUrl = post.image

  if (deleteImage === "true" && post.image) {

    // eliminar la img de cloudinatry
    const publicId = post.image.split("/").pop()?.split(".")[0]
    if (publicId) {
      await cloudinary.uploader.destroy(publicId)
    }
    updatedImageUrl = null
  }

  const updatedPost = await prisma.post.update({
    where: { id: Number(postId) },
    data: {
      content: content,
      image: updatedImageUrl,
    },
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
          likes: true,
        },
      },
    },
  })

  return NextResponse.json(updatedPost)
}
 
export async function DELETE(    
  request: NextRequest,
    context: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { postId } = await context.params;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  })

  if (!post || post.userId !== user.id) {
    return NextResponse.json({ error: "No autorizado para eliminar este post" }, { status: 403 })
  }

  if (post.image) {
    const publicId = post.image.split("/").pop()?.split(".")[0]
    if (publicId) {
      await cloudinary.uploader.destroy(publicId)
    }
  }

  await prisma.post.delete({
    where: { id: Number(postId) },
  })

  return NextResponse.json({ message: "Post eliminado exitosamente" })
}

