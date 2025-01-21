//app\api\premios\[premioId]\route.ts
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";


type RouteContext = {
  params: Promise<{ premioId: string }>;
};


export async function GET(
    req: NextRequest,
    context: RouteContext
) {
  try {
    const { premioId } = await context.params;

    const premio = await prisma.premio.findUnique({
      where: { id: parseInt(premioId) },
      select: {
        id: true,
        titulo: true,
        subtitulo: true,
        descripcion: true,
        imagen: true,
        logros: {
          select: {
            logro: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        },
      },
    });

    if (!premio) {
      return new NextResponse("Premio no encontrado", { status: 404 });
    }

    return NextResponse.json(premio);
  } catch (error) {
    console.error("[PREMIO_DINAMICO_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { premioId } = await context.params;

    const { titulo, subtitulo, descripcion, imagen } = await req.json();

    // Validaciones básicas
    if (!titulo || !subtitulo || !descripcion || !imagen) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    const updatedPremio = await prisma.premio.update({
      where: { id: parseInt(premioId) },
      data: {
        titulo,
        subtitulo,
        descripcion,
        imagen,
      },
    });

    return NextResponse.json(updatedPremio);
  } catch (error) {
    console.error("[PREMIO_UPDATE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { premioId } = await context.params;

    const premioDeleted = await prisma.premio.delete({
      where: { id: parseInt(premioId) },
    });

    return new NextResponse(JSON.stringify(premioDeleted), { status: 200 });
  } 
  catch (error) {
    console.error("[PREMIO_DELETE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

