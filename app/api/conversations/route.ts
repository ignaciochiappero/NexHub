import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: parseInt(session.user.id)
        }
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      messages: {
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  return new NextResponse(JSON.stringify(conversations), { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const { participantIds } = await req.json();

  // poner al usuario activo en la conversacion
  const uniqueParticipantIds = Array.from(new Set([...participantIds, parseInt(session.user.id)]));

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: uniqueParticipantIds.map(userId => ({
          userId: userId
        }))
      }
    },
    include: {
      participants: {
        include: {
          user: true
        }
      }
    }
  });

  return new NextResponse(JSON.stringify(conversation), { status: 201 });
}

