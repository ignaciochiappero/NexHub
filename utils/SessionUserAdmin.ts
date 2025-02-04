
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";
import prisma from "@/libs/prisma";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(session.user.id)
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  return user;
}

