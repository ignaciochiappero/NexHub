
//app\api\logros\[logroId]\premios\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

type RouteContext = {
  params: Promise<{ logroId: string }>;
};

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { logroId } = await context.params;

    const logro = await prisma.logro.findUnique({
      where: { id: parseInt(logroId) },
      include: {
        premios: {
          include: {
            premio: true,
          },
        },
      },
    });

    if (!logro) {
      return new NextResponse("Logro no encontrado", { status: 404 });
    }

    return NextResponse.json(logro.premios.map(lp => lp.premio));
  } catch (error) {
    console.error("[LOGRO_PREMIOS_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { logroId } = await context.params;
    const { premioId } = await req.json();

    const logroPremio = await prisma.logroPremio.create({
      data: {
        logroId: parseInt(logroId),
        premioId: parseInt(premioId),
      },
    });

    return NextResponse.json(logroPremio, { status: 201 });
  } catch (error) {
    console.error("[LOGRO_PREMIOS_POST_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { logroId } = await context.params;
    const { premioId } = await req.json();

    const deletedLogroPremio = await prisma.logroPremio.delete({
      where: {
        logroId_premioId: {
          logroId: parseInt(logroId),
          premioId: parseInt(premioId),
        },
      },
    });

    return NextResponse.json(deletedLogroPremio, { status: 200 });
  } catch (error) {
    console.error("[LOGRO_PREMIOS_DELETE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}