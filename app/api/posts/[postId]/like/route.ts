//app\api\posts\[postId]\like\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";


type RouteContext = {
  params: Promise<{ postId: string }>;
};


export async function POST(  req: NextRequest,
  { params }: RouteContext) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { postId } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: Number(postId),
        userId: user.id,
      },
    },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: { id: existingLike.id },
    });

  } else {
    
    await prisma.postLike.create({
      data: {
        postId: Number(postId),
        userId: user.id,
      },
    });
  }

  const updatedPost = await prisma.post.findUnique({
    where: { id: Number(postId) },
    include: {
      likes: true,
    },
  });

  return NextResponse.json({
    likes: updatedPost?.likes.length || 0,
    isLiked: !existingLike,
  });
}

