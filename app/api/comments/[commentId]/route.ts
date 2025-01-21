import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

type RouteContext = {
  params: Promise<{ commentId: string }>;
};

export async function PUT(request: NextRequest,
  { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { commentId } = await params;

  const data = await request.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });

  if (!comment || comment.userId !== user.id) {
    return NextResponse.json({ error: "No autorizado para editar este comentario" }, { status: 403 });
  }

  const updatedComment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data: { content: data.content },
    include: {
      user: true,
      likes: true,
    },
  });

  return NextResponse.json(updatedComment);
}

export async function DELETE(request: NextRequest,
  { params }: RouteContext)  {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { commentId } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });

  if (!comment || comment.userId !== user.id) {
    return NextResponse.json({ error: "No autorizado para eliminar este comentario" }, { status: 403 });
  }

  await prisma.comment.delete({
    where: { id: Number(commentId) },
  });

  return NextResponse.json({ message: "Comentario eliminado exitosamente" });
}

