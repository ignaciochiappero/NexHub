import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(request: Request, { params }: { params: { commentId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const commentId = parseInt(params.commentId);
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId: commentId,
        userId: user.id,
      },
    },
  });

  if (existingLike) {
    await prisma.commentLike.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: user.id,
      },
    });
  }

  const updatedComment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      likes: true,
    },
  });

  return NextResponse.json({
    likes: updatedComment?.likes.length || 0,
    isLiked: !existingLike,
  });
}

