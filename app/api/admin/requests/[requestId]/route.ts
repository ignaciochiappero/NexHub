
//app\api\admin\requests\[requestId]\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401 
      });
    }

    // Esperar la resolución de params de manera asíncrona
    const { requestId } = await params;
    if (!requestId) {
      return new NextResponse(JSON.stringify({ error: "Request ID is required" }), { 
        status: 400 
      });
    }

    const id = parseInt(requestId);
    const { action } = await req.json();

    const request = await prisma.achievementRequest.findUnique({
      where: { id },
      include: { logro: true },
    });

    if (!request) {
      return new NextResponse(JSON.stringify({ error: "Request not found" }), { 
        status: 404 
      });
    }

    if (action === 'approve') {
      await prisma.$transaction(async (prisma) => {
        await prisma.achievementRequest.update({
          where: { id },
          data: { status: 'approved' },
        });

        const userAchievement = await prisma.userAchievement.upsert({
          where: {
            userId_logroId: {
              userId: request.userId,
              logroId: request.logroId,
            },
          },
          update: {
            stepsProgress: { increment: 1 },
            progress: (request.step / request.logro.stepsFinal) * 100,
            completed: request.step === request.logro.stepsFinal,
          },
          create: {
            userId: request.userId,
            logroId: request.logroId,
            stepsProgress: 1,
            progress: (1 / request.logro.stepsFinal) * 100,
            completed: request.logro.stepsFinal === 1,
          },
        });

        return userAchievement;
      });
    } else if (action === 'reject') {
      await prisma.achievementRequest.update({
        where: { id },
        data: { status: 'rejected' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ACHIEVEMENT_REQUEST_UPDATE_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500 
    });
  }
}