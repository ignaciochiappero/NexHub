
//app\api\posts\route.ts

import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth.config";
import cloudinary from "@/libs/cloudinary"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const content = formData.get("content") as string
    const file = formData.get("file") as File | null

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    let imageUrl = null
    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "posts",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        uploadStream.end(buffer)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      imageUrl = (result as any).secure_url
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        userId: user.id,
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

