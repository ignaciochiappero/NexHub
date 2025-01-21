//app\api\achievements\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = parseInt(session.user.id);

  try {
    const achievements = await prisma.logro.findMany({
      include: {
        achievements: {
          where: { userId },
        },
      },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("[ACHIEVEMENTS_GET_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const { logroId, step } = await req.json();

  try {
    const request = await prisma.achievementRequest.create({
      data: {
        userId,
        logroId,
        step,
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("[ACHIEVEMENT_REQUEST_POST_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

