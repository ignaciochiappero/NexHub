//app\dashboard\messages\page.tsx

import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth.config"
import prisma from "@/libs/prisma"
import MessagesClient from "../../../components/messagesComponents/MessagesClient"

async function loadData() {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("No estás logueado")

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: Number.parseInt(session.user.id),
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: Number.parseInt(session.user.id),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  })

  return { session, conversations, users }
}

export default async function MessagesPage() {
  const { session, conversations, users } = await loadData()

  const transformedConversations = conversations.map((conversation) => ({
    ...conversation,
    participants: conversation.participants.map((participant) => ({
      ...participant,
      user: {
        ...participant.user,
        image: participant.user.image ?? undefined,
      },
    })),
  }));

  return (
    <div className=" pt-28 font-[family-name:var(--blender-medium)] flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] pb-10">
      <MessagesClient session={session} initialConversations={transformedConversations} initialUsers={users} />
    </div>
  )
}

