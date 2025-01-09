import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId);
  const comments = await prisma.comment.findMany({
    where: { postId: postId },
    include: {
      user: true,
      likes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request, { params }: { params: { postId: string } }) {
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

  const newComment = await prisma.comment.create({
    data: {
      content: data.content,
      postId: postId,
      userId: user.id,
    },
    include: {
      user: true,
      likes: true,
    },
  });

  return NextResponse.json(newComment, { status: 201 });
}

