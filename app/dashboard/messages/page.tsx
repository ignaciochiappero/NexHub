//app\dashboard\messages\page.tsx

import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";
import prisma from "@/libs/prisma";
import MessagesClient from "./MessagesClient";

async function loadData() {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("No estás logueado");

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
        },
        include: {
          sender: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: parseInt(session.user.id)
      }
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  return { session, conversations, users };
}

export default async function MessagesPage() {
  const { session, conversations, users } = await loadData();

  return (
    <div className="pt-28 font-[family-name:var(--blender-medium)] flex flex-col justify-center items-center h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]">
      <MessagesClient session={session} initialConversations={conversations} initialUsers={users} />
    </div>
  );
}

