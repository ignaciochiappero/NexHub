
//app\api\posts\route.ts
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const posts = await prisma.post.findMany({
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
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const data = await request.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const newPost = await prisma.post.create({
    data: {
      content: data.content,
      userId: user.id,
    },
    include: {
      user: true,
      likes: true,
      comments: true,
    },
  });

  return NextResponse.json(newPost, { status: 201 });
}

