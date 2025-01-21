//app\api\conversations\check\[userId]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/libs/prisma';
import { config as authOptions } from "@/auth.config";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const { userId } = await context.params;
    const currentUserId = parseInt(session.user.id);
    const targetUserId = parseInt(userId);

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: currentUserId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
      select: {
        id: true,
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error('[CONVERSATION_CHECK_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}