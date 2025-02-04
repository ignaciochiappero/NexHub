

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function GET() {

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const logros = await prisma.logro.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        stepsFinal: true,
        createdAt: true,
        premios: {
          select: {
            premio: {
              select: {
                id: true,
                titulo: true,
                subtitulo: true,
                descripcion: true,
                imagen: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedLogros = logros.map(logro => ({
      ...logro,
      premios: logro.premios.map(p => p.premio),
      stepsProgress: 0,
      progress: 0,
      completed: false
    }));

    return NextResponse.json(formattedLogros);
  } catch (error) {
    console.error("[LOGROS_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string
    },
    select: {
      role: true
    }
  })

  if (user?.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await req.json();
    
    if (!body) {
      return new NextResponse(
        JSON.stringify({ error: "El cuerpo de la solicitud está vacío" }), 
        { status: 400 }
      );
    }

    const { title, description, icon, stepsFinal, premioIds = [] } = body;

    if (!title || !description || !icon || stepsFinal === undefined) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Faltan campos requeridos",
          received: { title, description, icon, stepsFinal }
        }), 
        { status: 400 }
      );
    }

    const logro = await prisma.logro.create({
      data: {
        title,
        description,
        icon,
        stepsFinal: Number(stepsFinal),
        premios: {
          create: premioIds.map((premioId: number) => ({
            premio: {
              connect: { id: premioId }
            }
          }))
        }
      },
      include: {
        premios: {
          include: {
            premio: true
          }
        }
      }
    });

    return NextResponse.json(logro, { status: 201 });
  } catch (error) {
    console.error("[LOGRO_POST_ERROR]", error);
    return new NextResponse(
      JSON.stringify({ error: "Error interno del servidor" }), 
      { status: 500 }
    );
  }
}