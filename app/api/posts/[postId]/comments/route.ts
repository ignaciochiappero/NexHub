//app\api\posts\[postId]\comments\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

type RouteContext = {
  params: Promise<{ postId: string }>;
};


export async function GET( req: NextRequest,
  { params }: RouteContext) {


  const { postId } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
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

export async function POST(request: NextRequest,
  { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }



  const { postId } = await params;

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
      postId: Number(postId),
      userId: user.id,
    },
    include: {
      user: true,
      likes: true,
    },
  });

  return NextResponse.json(newComment, { status: 201 });
}

