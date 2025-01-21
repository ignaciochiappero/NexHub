//app\api\conversations\[conversationId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

// Obtener mensajes de una conversación
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { conversationId } = await params;
    
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
  } catch (error) {
    console.error("[MESSAGES_GET_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}

// Enviar un nuevo mensaje
export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { conversationId } = await params;
    
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
  } catch (error) {
    console.error("[MESSAGE_CREATE_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}