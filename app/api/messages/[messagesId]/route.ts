
//app\api\messages\[messagesId]\route.ts

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
  params: Promise<{ messagesId: string }>;
};


// Añadir el método GET
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { messagesId } = await context.params;

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "No autorizado" }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Obtener los mensajes de la conversación
    const messages = await prisma.message.findMany({
      where: {
        conversationId: Number(messagesId)
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return new NextResponse(
      JSON.stringify(messages),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error("[MESSAGES_GET_ERROR]", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}


export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {


    const { messagesId } = await context.params;


    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "No autorizado" }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Verificar que recibimos el contenido
    const body = await req.json()
    if (!body?.content?.trim()) {
      return new NextResponse(
        JSON.stringify({ error: "Contenido requerido" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Verificar que el mensaje existe y pertenece al usuario
    const existingMessage = await prisma.message.findUnique({
      where: { id: Number(messagesId) },
      include: {
        sender: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })

    if (!existingMessage) {
      return new NextResponse(
        JSON.stringify({ error: "Mensaje no encontrado" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (existingMessage.senderId !== parseInt(session.user.id)) {
      return new NextResponse(
        JSON.stringify({ error: "No autorizado para editar este mensaje" }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Actualizar el mensaje
    const updatedMessage = await prisma.message.update({
      where: { id: Number(messagesId) },
      data: {
        content: body.content.trim(),
        updatedAt: new Date()
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // Notificar a través de Pusher
    await pusher.trigger(
      `conversation-${updatedMessage.conversationId}`,
      "message-updated",
      updatedMessage
    )

    return new NextResponse(
      JSON.stringify(updatedMessage),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error("[MESSAGE_UPDATE_ERROR]", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    // Esperar los parámetros
    const { messagesId } = await context.params;


    // Verificar la sesión
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "No autorizado" }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validar el ID del mensaje
    if (isNaN(Number(messagesId))) {
      return new NextResponse(
        JSON.stringify({ error: "ID de mensaje inválido" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Verificar que el mensaje existe y pertenece al usuario
    const message = await prisma.message.findUnique({
      where: { id: Number(messagesId) },
      select: { 
        id: true,
        senderId: true, 
        conversationId: true 
      }
    })

    if (!message) {
      return new NextResponse(
        JSON.stringify({ error: "Mensaje no encontrado" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (message.senderId !== parseInt(session.user.id)) {
      return new NextResponse(
        JSON.stringify({ error: "No autorizado para eliminar este mensaje" }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Eliminar el mensaje
    await prisma.message.delete({
      where: { id: Number(messagesId) }
    })

    // Notificar a través de Pusher
    await pusher.trigger(
      `conversation-${message.conversationId}`,
      "message-deleted",
      { messageId: Number(messagesId) } // Cambiado a messageId y asegurando que sea número
    )

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: "Mensaje eliminado correctamente",
        messagesId 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error("[MESSAGE_DELETE_ERROR]", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}