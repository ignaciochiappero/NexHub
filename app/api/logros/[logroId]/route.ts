// app\api\logros\[logroId]\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Obtener un logro específico
export async function GET(
  req: NextRequest,
  { params }: { params: { logroId: string } }
) {
  try {
    // Espera la resolución de params
    const { logroId } = await params; // Usar await aquí si params es asincrónico

    const logro = await prisma.logro.findUnique({
      where: { id: parseInt(logroId) },
      select: {
        id: true,
        title: true,
        description: true,

      },
    });

    if (!logro) {
      return new NextResponse("Logro no encontrado", { status: 404 });
    }

    return NextResponse.json(logro);
  } catch (error) {
    console.error("[logro_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// PUT: Actualizar un Logro
export async function PUT(
  req: NextRequest,
  { params }: { params: { logroId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { logroId } = await params; // Esperar params de manera asincrónica
    
    if (parseInt(session.user.id) !== parseInt(logroId)) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { title, description } = await req.json();

    const updatedlogro = await prisma.logro.update({
      where: { id: parseInt(logroId) },
      data: {
        title,
        description
      },
    });

    return NextResponse.json(updatedlogro);
  } catch (error) {
    console.error("[logro_UPDATE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// DELETE: Eliminar un Logro
export async function DELETE(
  req: NextRequest,
  { params }: { params: { logroId: string } }
) {
  try {
    const { logroId } = await params; // Usar await para params

    const logroDeleted = await prisma.logro.delete({
      where: { id: parseInt(logroId) }
    });

    return new NextResponse(JSON.stringify(logroDeleted), { status: 200 });
  } catch (error) {
    console.error("[logro_DELETE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
