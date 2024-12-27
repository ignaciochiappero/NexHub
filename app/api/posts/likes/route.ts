
//app\api\posts\[postId]\likes\route.ts

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { postId } = await request.json();

    // Obtener el usuario actual
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Buscar si ya existe un like
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id
        }
      }
    });

    if (existingLike) {
      // Si existe, eliminar el like
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      // Si no existe, crear nuevo like
      await prisma.like.create({
        data: {
          postId: postId,
          userId: user.id
        }
      });
    }

    // Obtener el número actualizado de likes
    const likesCount = await prisma.like.count({
      where: {
        postId: postId
      }
    });

    return NextResponse.json({ 
      likes: likesCount,
      isLiked: !existingLike 
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar like" }, { status: 500 });
  }
}