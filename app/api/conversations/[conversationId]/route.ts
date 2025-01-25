//app\api\conversations\[conversationId]\route.ts

import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/libs/prisma"
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth.config"
import Pusher from "pusher"

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

type RouteContext = {
  params: Promise<{ conversationId: string }>
}

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
// Updated POST function
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { conversationId } = await params

    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 })
    }

    const { content } = await req.json()

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: Number.parseInt(conversationId),
        senderId: Number.parseInt(session.user.id),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          },
        },
      },
    })

    // Trigger Pusher event
    await pusher.trigger(`conversation-${conversationId}`, "new-message", message)

    return new NextResponse(JSON.stringify(message), { status: 201 })
  } catch (error) {
    console.error("[MESSAGE_CREATE_ERROR]", error)
    return new NextResponse(JSON.stringify({ error: "Error interno" }), { status: 500 })
  }
}


// DELETE: Eliminar un usuario
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { conversationId } = await context.params;

    const conversationDeleted = await prisma.conversation.delete({
      where: { id: parseInt(conversationId) }
    });

    return new NextResponse(JSON.stringify(conversationDeleted), { status: 200 });
  } catch (error) {
    console.error("[CONVERSATION_DELETE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}