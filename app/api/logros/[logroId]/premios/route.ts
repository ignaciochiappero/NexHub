import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { logroId: string } }
) {
  try {
    const { logroId } = params;

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
  { params }: { params: { logroId: string } }
) {
  try {
    const { logroId } = params;
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
  { params }: { params: { logroId: string } }
) {
  try {
    const { logroId } = params;
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

