//app\api\conversations\[conversationId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Obtener mensajes de una conversación
export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;
  
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId: parseInt(conversationId),
      conversation: {
        participants: {
          some: {
            userId: parseInt(session.user.id)
          }
        }
      }
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return new NextResponse(JSON.stringify(messages), { status: 200 });
}

// Enviar un nuevo mensaje
export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;
  
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const { content } = await req.json();

  const message = await prisma.message.create({
    data: {
      content,
      conversationId: parseInt(conversationId),
      senderId: parseInt(session.user.id)
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return new NextResponse(JSON.stringify(message), { status: 201 });
}

