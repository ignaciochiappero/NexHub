import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId);
  const post = await prisma.post.findUnique({
    where: { id: postId },
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
  });

  if (!post) {
    return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const postId = parseInt(params.postId);
  const data = await request.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.userId !== user.id) {
    return NextResponse.json({ error: "No autorizado para editar este post" }, { status: 403 });
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { content: data.content },
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
  });

  return NextResponse.json(updatedPost);
}

export async function DELETE(request: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const postId = parseInt(params.postId);
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.userId !== user.id) {
    return NextResponse.json({ error: "No autorizado para eliminar este post" }, { status: 403 });
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json({ message: "Post eliminado exitosamente" });
}

