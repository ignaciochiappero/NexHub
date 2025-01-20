//app\api\users\online\route.ts

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const userId = parseInt(session.user.id);

    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_STATUS_UPDATE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

