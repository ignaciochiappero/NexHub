import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: NextRequest, { params }: { params: { requestId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session ) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const requestId = parseInt(params.requestId);
  const { action } = await req.json();

  try {
    const request = await prisma.achievementRequest.findUnique({
      where: { id: requestId },
      include: { logro: true },
    });

    if (!request) {
      return new NextResponse(JSON.stringify({ error: "Request not found" }), { status: 404 });
    }

    if (action === 'approve') {
      await prisma.$transaction(async (prisma) => {
        // Update the request status
        await prisma.achievementRequest.update({
          where: { id: requestId },
          data: { status: 'approved' },
        });

        // Update or create the user's achievement
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
        where: { id: requestId },
        data: { status: 'rejected' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ACHIEVEMENT_REQUEST_UPDATE_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

