
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ logroId: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
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

    return NextResponse.json(logro);
  } catch (error) {
    console.error("[LOGRO_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { logroId } = await context.params;
    const {
      title,
      description,
      icon,
      stepsFinal,
      premioIds = [],
    } = await req.json();

    if (!title || !description || !icon || stepsFinal === undefined) {
      return new NextResponse(
        JSON.stringify({
          error: "Faltan campos requeridos",
          received: { title, description, icon, stepsFinal },
        }),
        { status: 400 }
      );
    }

    await prisma.logroPremio.deleteMany({
      where: {
        logroId: parseInt(logroId),
      },
    });

    const updatedLogro = await prisma.logro.update({
      where: { id: parseInt(logroId) },
      data: {
        title,
        description,
        icon,
        stepsFinal: Number(stepsFinal),
        premios: {
          create: premioIds.map((premioId: number) => ({
            premio: {
              connect: { id: premioId },
            },
          })),
        },
      },
      include: {
        premios: {
          include: {
            premio: true,
          },
        },
      },
    });

    return NextResponse.json(updatedLogro);
  } catch (error) {
    console.error("[LOGRO_UPDATE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { logroId } = await context.params;

    await prisma.logroPremio.deleteMany({
      where: { logroId: parseInt(logroId) },
    });

    const logroDeleted = await prisma.logro.delete({
      where: { id: parseInt(logroId) },
    });

    return NextResponse.json(logroDeleted, { status: 200 });
  } catch (error) {
    console.error("[LOGRO_DELETE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
